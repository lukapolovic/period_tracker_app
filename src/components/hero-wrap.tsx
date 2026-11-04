import {
  Canvas,
  Group,
  LinearGradient,
  Path,
  Skia,
  TextPath,
  useFont,
  vec,
  type SkPath,
} from '@shopify/react-native-skia';
import { useEffect, useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { useFlow } from '@/flow/flow-provider';
import { canvasOverlay, useTheme } from '@/theme';

/**
 * The ribbon's route around the disc, in disc radii from its centre: in from the left, behind the disc,
 * around the right, across the front, around the left, behind again and out to the right.
 */
const ROUTE: readonly (readonly [number, number])[] = [
  [-2.5, -0.16],
  [-1.7, -0.5],
  [-0.9, -0.86],
  [0.1, -0.98],
  [0.98, -0.76],
  [1.4, -0.14],
  [1.28, 0.62],
  [0.72, 1.03],
  [-0.02, 1.14],
  [-0.8, 1.02],
  [-1.3, 0.64],
  [-1.42, 0.2],
  [-0.9, 0.0],
  [0.1, 0.04],
  [1.0, 0.16],
  [1.7, 0.3],
  [2.6, 0.12],
];

/** Where the route is cut: under the crossing, across the front, and back out. */
const CUT = { shaded: 4, front: 6, back: 10 };

function curve(points: readonly (readonly [number, number])[], from: number, to: number, dy = 0): string {
  const at = (i: number) => points[Math.min(Math.max(i, 0), points.length - 1)];
  let d = `M ${points[from][0]} ${points[from][1] + dy}`;
  for (let i = from; i < to; i++) {
    const [ax, ay] = at(i - 1);
    const [bx, by] = at(i);
    const [cx, cy] = at(i + 1);
    const [ex, ey] = at(i + 2);
    d += ` C ${bx + (cx - ax) / 6} ${by + (cy - ay) / 6 + dy} ${cx - (ex - bx) / 6} ${cy - (ey - by) / 6 + dy} ${cx} ${cy + dy}`;
  }
  return d;
}

function lengthOf(path: SkPath) {
  const iter = Skia.ContourMeasureIter(path, false, 1);
  let total = 0;
  for (let contour = iter.next(); contour; contour = iter.next()) total += contour.length();
  return total;
}

function buildWrap(cx: number, cy: number, r: number) {
  const points = ROUTE.map(([x, y]) => [cx + x * r, cy + y * r] as const);
  const make = (from: number, to: number) => Skia.Path.MakeFromSVGString(curve(points, from, to))!;
  const parts = {
    start: make(0, CUT.shaded),
    under: make(CUT.shaded, CUT.front),
    front: make(CUT.front, CUT.back),
    end: make(CUT.back, points.length - 1),
  };
  const lengths = {
    start: lengthOf(parts.start),
    under: lengthOf(parts.under),
    front: lengthOf(parts.front),
    end: lengthOf(parts.end),
  };
  const total = lengths.start + lengths.under + lengths.front + lengths.end;

  // Text reads left to right, so it follows the front stretch backwards, nudged down to centre on the band.
  const backwards = [...points].reverse();
  const n = points.length - 1;
  const text = Skia.Path.MakeFromSVGString(curve(backwards, n - CUT.back, n - CUT.front, 5))!;

  return {
    parts,
    text,
    textLength: lengthOf(text),
    fractions: {
      start: lengths.start / total,
      under: lengths.under / total,
      front: lengths.front / total,
      end: lengths.end / total,
    },
    joints: { under: points[CUT.shaded], front: points[CUT.front], mid: points[8] },
  };
}

/** Darkens the ribbon only where it dives behind the disc. */
const BEHIND = [0, 0.1, 0.24, 0.76, 0.9, 1];

const clamp01 = (v: number) => {
  'worklet';
  return Math.min(Math.max(v, 0), 1);
};

type HeroWrapProps = {
  page: number;
  /** Radius of the disc. */
  radius: number;
  height: number;
  /** Runs along the front of the ribbon. Screen readers get it from `accessibilityLabel`. */
  ribbonText: string;
  children: ReactNode;
};

/**
 * The ribbon wrapped around the disc. The disc sits between two canvases, so the ribbon passes behind it,
 * comes around and crosses in front. The ribbon winds itself on when the page arrives and unwinds when it leaves.
 */
export function HeroWrap({ page, radius, height, ribbonText, children }: HeroWrapProps) {
  const { colors } = useTheme();
  const { width, progress, reduceMotion } = useFlow();
  const font = useFont(require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'), 15);

  const cx = width / 2;
  const cy = height / 2 - radius * 0.1;
  const band = radius * 0.34;
  const wrap = useMemo(() => buildWrap(cx, cy, radius), [cx, cy, radius]);
  const { fractions, parts, joints } = wrap;

  const intro = useSharedValue(reduceMotion ? 1 : 0);
  useEffect(() => {
    if (reduceMotion) return;
    intro.set(withDelay(240, withTiming(1, { duration: 1500, easing: Easing.bezier(0.5, 0, 0.14, 1) })));
  }, [intro, reduceMotion]);

  // How much of the route is showing, from 0 to 1.
  const drawn = useDerivedValue(() => {
    if (reduceMotion) return 1;
    const away = Math.min(Math.abs(progress.get() - page) * 1.5, 1);
    return Math.min(intro.get(), 1 - away);
  });

  const a = fractions.start;
  const b = a + fractions.under;
  const c = b + fractions.front;

  const startEnd = useDerivedValue(() => clamp01(drawn.get() / a));
  const underEnd = useDerivedValue(() => clamp01((drawn.get() - a) / fractions.under));
  const frontEnd = useDerivedValue(() => clamp01((drawn.get() - b) / fractions.front));
  const lastEnd = useDerivedValue(() => clamp01((drawn.get() - c) / fractions.end));
  const startOn = useDerivedValue(() => (drawn.get() > 0.001 ? 1 : 0));
  const underOn = useDerivedValue(() => (drawn.get() > a ? 1 : 0));
  const frontOn = useDerivedValue(() => (drawn.get() > b ? 1 : 0));
  const lastOn = useDerivedValue(() => (drawn.get() > c ? 1 : 0));
  const textOpacity = useDerivedValue(() => clamp01((drawn.get() - c + 0.02) / 0.05));

  const sun = colors.ribbonSun;
  const shade = colors.ribbonSunShade;
  const leftEdge = vec(cx - radius * 1.4, cy);
  const rightEdge = vec(cx + radius * 1.4, cy);
  const stroke = { style: 'stroke', strokeWidth: band, strokeCap: 'round', strokeJoin: 'round' } as const;
  const textWidth = font ? font.measureText(ribbonText).width : 0;

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Canvas style={canvasOverlay}>
        <Group opacity={startOn}>
          <Path path={parts.start} end={startEnd} {...stroke}>
            <LinearGradient start={leftEdge} end={rightEdge} colors={[sun, sun, shade, shade, sun, sun]} positions={BEHIND} />
          </Path>
        </Group>
        <Group opacity={underOn}>
          <Path path={parts.under} end={underEnd} {...stroke}>
            <LinearGradient
              start={vec(joints.under[0], joints.under[1])}
              end={vec(joints.front[0], joints.front[1])}
              colors={[sun, shade, shade]}
              positions={[0, 0.7, 1]}
            />
          </Path>
        </Group>
        <Group opacity={lastOn}>
          <Path path={parts.end} end={lastEnd} {...stroke}>
            <LinearGradient start={leftEdge} end={rightEdge} colors={[sun, sun, shade, shade, sun, sun]} positions={BEHIND} />
          </Path>
        </Group>
      </Canvas>

      <View style={[styles.disc, { left: cx - radius, top: cy - radius, width: radius * 2, height: radius * 2, borderRadius: radius, backgroundColor: colors.surface }]}>
        {children}
      </View>

      <Canvas style={canvasOverlay}>
        <Group opacity={frontOn}>
          <Path path={parts.front} end={frontEnd} {...stroke}>
            <LinearGradient
              start={vec(joints.front[0], joints.front[1])}
              end={vec(joints.mid[0], joints.mid[1])}
              colors={[shade, sun]}
              positions={[0, 0.8]}
            />
          </Path>
        </Group>
        {font ? (
          <Group opacity={textOpacity}>
            <TextPath
              path={wrap.text}
              font={font}
              text={ribbonText}
              initialOffset={Math.max((wrap.textLength - textWidth) / 2, 0)}
              color={colors.onRibbonSun}
            />
          </Group>
        ) : null}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  disc: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});
