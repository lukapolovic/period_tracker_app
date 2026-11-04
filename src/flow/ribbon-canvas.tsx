import { LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import type { ColorTokens } from '@/theme';

import { appendSpline, type RibbonState } from './ribbon-sim';
import type { RibbonSpan, RibbonSpec } from './world';

type RibbonStrokeProps = {
  spec: RibbonSpec;
  span: RibbonSpan;
  state: SharedValue<RibbonState>;
  offset: number;
  width: number;
  colors: ColorTokens;
};

/** One stretch of a ribbon. Shaded stretches darken mid-way, like the underside of a fold. */
function RibbonStroke({ spec, span, state, offset, width, colors }: RibbonStrokeProps) {
  const total = spec.points.length;
  const { from, to } = span;
  const shaded = !!span.shaded;

  // Rebuilt only when the simulation moves, so an idle screen costs nothing.
  const builder = useMemo(() => Skia.PathBuilder.Make(), []);
  const path = useDerivedValue(() => {
    const s = state.get();
    builder.reset();
    appendSpline(builder, s.px, s.py, offset, total, from, to);
    return builder.build();
  });

  const start = useDerivedValue(() => {
    const s = state.get();
    return vec(s.px[offset + from], s.py[offset + from]);
  });
  const end = useDerivedValue(() => {
    const s = state.get();
    return vec(s.px[offset + to], s.py[offset + to]);
  });

  const color = colors[spec.color];
  const shade = colors[spec.shade];

  return (
    <Path path={path} style="stroke" strokeWidth={spec.width * width} strokeCap="round" strokeJoin="round" color={color}>
      {shaded ? (
        <LinearGradient start={start} end={end} colors={[color, shade, shade, color]} positions={[0, 0.34, 0.66, 1]} />
      ) : null}
    </Path>
  );
}

type RibbonLayerProps = {
  specs: RibbonSpec[];
  offsets: number[];
  state: SharedValue<RibbonState>;
  width: number;
  /** Passed in: React context doesn't reach inside a Skia canvas. */
  colors: ColorTokens;
  /** Which side of the content this canvas sits on. */
  front: boolean;
};

/** Paints every stretch that belongs on one side of the content, under-strands first. */
export function RibbonLayer({ specs, offsets, state, width, colors, front }: RibbonLayerProps) {
  return specs.flatMap((spec, r) =>
    spec.spans
      .filter((span) => !!span.front === front)
      .sort((a, b) => Number(!!b.shaded) - Number(!!a.shaded))
      .map((span) => (
        <RibbonStroke
          key={`${spec.key}-${span.from}`}
          spec={spec}
          span={span}
          state={state}
          offset={offsets[r]}
          width={width}
          colors={colors}
        />
      )),
  );
}
