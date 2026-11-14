import type { SkPathBuilder } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { useFrameCallback, useSharedValue, type SharedValue } from 'react-native-reanimated';

import type { FlowState } from './flow-provider';
import type { RibbonSpec } from './world';

/** Everything the frame loop needs, flattened so a frame touches only plain number arrays. */
type Layout = {
  count: number;
  baseX: number[];
  baseY: number[];
  parallax: number[];
  scrollParallax: number[];
  stiffness: number[];
  damping: number[];
  bend: number[];
  phase: number[];
};

export type RibbonState = {
  /** Spring positions. */
  x: number[];
  y: number[];
  vx: number[];
  vy: number[];
  /** Where each point is drawn: the spring position plus the bend from its lag. */
  px: number[];
  py: number[];
  awake: boolean;
};

function flatten(specs: RibbonSpec[], width: number, height: number): Layout {
  const layout: Layout = {
    count: 0,
    baseX: [],
    baseY: [],
    parallax: [],
    scrollParallax: [],
    stiffness: [],
    damping: [],
    bend: [],
    phase: [],
  };
  specs.forEach((spec, r) => {
    spec.points.forEach(([x, y], i) => {
      // Neighbouring points get slightly different springs, so a moving line stretches and curves
      // along its length instead of sliding as one rigid shape.
      const k = spec.stiffness * (1 + 0.42 * Math.sin(i * 0.85 + r * 1.9));
      layout.baseX.push(x * width);
      layout.baseY.push(y * height);
      layout.parallax.push(spec.parallax);
      layout.scrollParallax.push(spec.scrollParallax);
      layout.stiffness.push(k);
      layout.damping.push(2 * 0.58 * Math.sqrt(k));
      layout.bend.push(spec.bend);
      layout.phase.push(i * 1.25 + r * 0.8);
      layout.count += 1;
    });
  });
  return layout;
}

function restState(layout: Layout, cam: number, scroll: number, liftBy: number): RibbonState {
  const x = layout.baseX.map((v, i) => v - cam * layout.parallax[i]);
  const y = layout.baseY.map((v, i) => v - scroll * layout.scrollParallax[i] - liftBy * layout.parallax[i]);
  return {
    x,
    y,
    vx: layout.baseX.map(() => 0),
    vy: layout.baseX.map(() => 0),
    px: [...x],
    py: [...y],
    awake: true,
  };
}

/**
 * The ribbon physics. Each control point chases its target on a soft spring; how far it lags becomes a
 * sideways bend, so a line curves as it moves and relaxes when it stops. Idle frames do nothing.
 */
export function useRibbonSim(specs: RibbonSpec[], flow: FlowState): SharedValue<RibbonState> {
  const { width, height, progress, scrollY, lift, reduceMotion } = flow;
  const layout = useMemo(() => flatten(specs, width, height), [specs, width, height]);
  const liftBy = height * 0.34;

  const state = useSharedValue<RibbonState>(restState(layout, 0, 0, 0));

  useEffect(() => {
    state.set(restState(layout, progress.get() * width, scrollY.get(), lift.get() * liftBy));
  }, [layout, width, liftBy, progress, scrollY, lift, state]);

  useFrameCallback((frame) => {
    'worklet';
    const dt = Math.min((frame.timeSincePreviousFrame ?? 16) / 1000, 1 / 30);
    const cam = progress.get() * width;
    const scroll = scrollY.get();
    const up = lift.get() * liftBy;
    const current = state.get();

    if (!current.awake) {
      // Nothing moves unless a target has: compare one point instead of running the whole loop.
      const tx = layout.baseX[0] - cam * layout.parallax[0];
      const ty = layout.baseY[0] - scroll * layout.scrollParallax[0] - up * layout.parallax[0];
      if (Math.abs(tx - current.x[0]) < 0.02 && Math.abs(ty - current.y[0]) < 0.02) return;
    }

    state.modify((s) => {
      'worklet';
      let energy = 0;
      for (let i = 0; i < layout.count; i++) {
        const tx = layout.baseX[i] - cam * layout.parallax[i];
        const ty = layout.baseY[i] - scroll * layout.scrollParallax[i] - up * layout.parallax[i];
        if (reduceMotion) {
          s.x[i] = tx;
          s.y[i] = ty;
          s.vx[i] = 0;
          s.vy[i] = 0;
          s.px[i] = tx;
          s.py[i] = ty;
          continue;
        }
        const k = layout.stiffness[i];
        const c = layout.damping[i];
        s.vx[i] += (k * (tx - s.x[i]) - c * s.vx[i]) * dt;
        s.vy[i] += (k * (ty - s.y[i]) - c * s.vy[i]) * dt;
        s.x[i] += s.vx[i] * dt;
        s.y[i] += s.vy[i] * dt;

        const lagX = s.x[i] - tx;
        const lagY = s.y[i] - ty;
        const wave = Math.sin(layout.phase[i]);
        const bend = layout.bend[i];
        s.px[i] = s.x[i] + lagY * bend * 0.55 * wave;
        s.py[i] = s.y[i] + lagX * bend * wave;

        energy += Math.abs(lagX) + Math.abs(lagY) + Math.abs(s.vx[i]) * 0.02 + Math.abs(s.vy[i]) * 0.02;
      }
      s.awake = energy > layout.count * 0.03;
      if (!s.awake) {
        // Land exactly on target, so the idle check above holds until something really moves.
        for (let i = 0; i < layout.count; i++) {
          const tx = layout.baseX[i] - cam * layout.parallax[i];
          const ty = layout.baseY[i] - scroll * layout.scrollParallax[i] - up * layout.parallax[i];
          s.x[i] = tx;
          s.y[i] = ty;
          s.vx[i] = 0;
          s.vy[i] = 0;
          s.px[i] = tx;
          s.py[i] = ty;
        }
      }
      return s;
    }, true);
  });

  return state;
}

/** Appends one stretch of a ribbon to a path as a Catmull-Rom spline, using the whole ribbon for its tangents. */
export function appendSpline(
  builder: SkPathBuilder,
  xs: number[],
  ys: number[],
  offset: number,
  total: number,
  from: number,
  to: number,
) {
  'worklet';
  builder.moveTo(xs[offset + from], ys[offset + from]);
  for (let i = from; i < to; i++) {
    const a = offset + Math.max(i - 1, 0);
    const b = offset + i;
    const c = offset + i + 1;
    const d = offset + Math.min(i + 2, total - 1);
    builder.cubicTo(
      xs[b] + (xs[c] - xs[a]) / 6,
      ys[b] + (ys[c] - ys[a]) / 6,
      xs[c] - (xs[d] - xs[b]) / 6,
      ys[c] - (ys[d] - ys[b]) / 6,
      xs[c],
      ys[c],
    );
  }
}
