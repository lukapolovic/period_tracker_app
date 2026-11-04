import { Canvas, Group, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import { useMemo, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { useDerivedValue, withSpring } from 'react-native-reanimated';

import { canvasOverlay, useTheme, type ColorTokens } from '@/theme';

import { useFlow } from './flow-provider';
import { appendSpline } from './ribbon-sim';

/** Room above the card for the ribbon to arc through. */
const HEADROOM = 96;
/** Past the screen edge, so the ribbon's ends are never seen. */
const OVERHANG = 40;
const LINE = 16;
/** The arc's highest point in the chain below, where the ribbon changes sides. */
const APEX = 3;
const POINTS = 7;
const SOFT = { damping: 15, stiffness: 70, mass: 1 };

type Tone = { line: keyof ColorTokens; shade: keyof ColorTokens };

const TONES = {
  coral: { line: 'ribbonCoral', shade: 'ribbonCoralShade' },
  sky: { line: 'ribbonSky', shade: 'ribbonSkyShade' },
  sun: { line: 'ribbonSun', shade: 'ribbonSunShade' },
} satisfies Record<string, Tone>;

type RibbonHopProps = {
  page: number;
  tone: keyof typeof TONES;
  children: ReactNode;
};

/**
 * A ribbon that jumps over a card: it runs behind the card, rises out above its top edge and lands over its
 * top right corner. Keep that corner free of text. The arc is tied to the page's scroll, so it leaps while
 * the page moves and settles when it stops.
 */
export function RibbonHop({ page, tone, children }: RibbonHopProps) {
  const { colors } = useTheme();
  const { width: screen, progress, offsets, reduceMotion } = useFlow();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width: w } = size;

  const left = (screen - w) / 2 + OVERHANG;
  const top = HEADROOM;
  const line = colors[TONES[tone].line];
  const shade = colors[TONES[tone].shade];

  // Everything is measured from the canvas corner: the card starts at (left, top).
  const route = useMemo(
    () => ({
      xs: [-OVERHANG, left + w * 0.2, left + w * 0.5, left + w * 0.73, left + w * 0.93, left + w + 18, left + w + left],
      ys: [top + 70, top + 44, top + 6, top - 62, top - 10, top + 36, top + 52],
    }),
    [left, top, w],
  );

  // A slower copy of the scroll: the gap between the two is how hard the arc is jumping.
  const eased = useDerivedValue(() => withSpring(offsets.get()[page], SOFT));

  const leap = useDerivedValue(() => {
    if (reduceMotion) return 0;
    return Math.max(-34, Math.min(46, (offsets.get()[page] - eased.get()) * 0.3));
  });

  const under = useMemo(() => Skia.PathBuilder.Make(), []);
  const over = useMemo(() => Skia.PathBuilder.Make(), []);

  const bent = useDerivedValue(() => {
    const y = [...route.ys];
    const l = leap.get();
    y[APEX] -= l;
    y[APEX - 1] -= l * 0.35;
    y[APEX + 1] -= l * 0.35;
    return y;
  });

  const backPath = useDerivedValue(() => {
    under.reset();
    appendSpline(under, route.xs, bent.get(), 0, POINTS, 0, APEX);
    return under.build();
  });

  const frontPath = useDerivedValue(() => {
    over.reset();
    appendSpline(over, route.xs, bent.get(), 0, POINTS, APEX, POINTS - 1);
    return over.build();
  });

  // The ribbon draws itself as the page arrives, like the one around the disc on Today.
  const drawn = useDerivedValue(() => (reduceMotion ? 1 : 1 - Math.min(Math.abs(progress.get() - page) * 1.6, 1)));
  const backEnd = useDerivedValue(() => Math.min(drawn.get() * 2, 1));
  const frontEnd = useDerivedValue(() => Math.max(drawn.get() * 2 - 1, 0));
  const frontOn = useDerivedValue(() => (drawn.get() > 0.5 ? 1 : 0));
  const backOn = useDerivedValue(() => (drawn.get() > 0.001 ? 1 : 0));

  const stroke = { style: 'stroke', strokeWidth: LINE, strokeCap: 'round', strokeJoin: 'round' } as const;
  const canvas = {
    ...canvasOverlay,
    left: -left,
    right: undefined,
    width: screen + OVERHANG * 2,
    top: -HEADROOM,
    bottom: undefined,
    height: HEADROOM + 120,
  };

  return (
    <View onLayout={(e) => setSize(e.nativeEvent.layout)}>
      {w > 0 ? (
        <Canvas style={canvas}>
          <Group opacity={backOn}>
            <Path path={backPath} end={backEnd} color={line} {...stroke}>
              <LinearGradient
                start={vec(0, top + 70)}
                end={vec(left + w * 0.73, top - 62)}
                colors={[line, line, shade, line]}
                positions={[0, 0.55, 0.74, 1]}
              />
            </Path>
          </Group>
        </Canvas>
      ) : null}
      {children}
      {w > 0 ? (
        <Canvas style={canvas}>
          <Group opacity={frontOn}>
            <Path path={frontPath} end={frontEnd} color={line} {...stroke} />
          </Group>
        </Canvas>
      ) : null}
    </View>
  );
}
