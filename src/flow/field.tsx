import { Circle, Group, Image, Line, Oval, Path, Skia, useImage, vec } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import type { ColorTokens } from '@/theme';

import { ART } from './art';
import { WORLD_PAGES } from './world';

/** Height of each hill above the bottom of the screen, at rest and when a page reaches its end. */
export const FIELD = {
  back: { rest: 92, risen: 276, parallax: 0.34 },
  mid: { rest: 70, risen: 206, parallax: 0.5 },
  front: { rest: 44, risen: 128, parallax: 0.72 },
} as const;

type HillLayer = (typeof FIELD)[keyof typeof FIELD];

/** Tall enough that a risen field and its character never cover the end of a page. */
export const FIELD_CLEARANCE = FIELD.mid.risen + 132;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** A row of soft mounds meeting in small cusps, like the reference field. */
function hillPath(seed: number, length: number, width: [number, number], height: [number, number]) {
  const rand = seeded(seed);
  let x = -80;
  let d = `M ${x} 900 L ${x} 40`;
  let y = 40;
  while (x < length) {
    const w = width[0] + rand() * (width[1] - width[0]);
    const h = height[0] + rand() * (height[1] - height[0]);
    const nextY = 26 + rand() * 30;
    const nx = x + w;
    d += ` C ${x + w * 0.12} ${y - h * 1.1} ${nx - w * 0.16} ${nextY - h * 1.1} ${nx} ${nextY}`;
    x = nx;
    y = nextY;
  }
  d += ` L ${x} 900 Z`;
  return Skia.Path.MakeFromSVGString(d)!;
}

const ink = 1.4;

function Spokes({ cx, cy, rx, ry, count, color }: { cx: number; cy: number; rx: number; ry: number; count: number; color: string }) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + 0.3;
    return (
      <Line
        key={i}
        p1={vec(cx + Math.cos(a) * rx * 0.28, cy + Math.sin(a) * ry * 0.28)}
        p2={vec(cx + Math.cos(a) * rx * 0.98, cy + Math.sin(a) * ry * 0.98)}
        color={color}
        strokeWidth={ink}
      />
    );
  });
}

function Stem({ height, color, leafColor, lineColor, flip = 1 }: { height: number; color: string; leafColor: string; lineColor: string; flip?: 1 | -1 }) {
  const stem = useMemo(() => {
    const p = Skia.Path.MakeFromSVGString(`M 0 0 C ${flip * 6} ${height * 0.4} ${-flip * 5} ${height * 0.7} ${flip * 3} ${height}`)!;
    return p;
  }, [height, flip]);
  const leaf = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        `M ${flip * 2} ${height * 0.9} C ${flip * 10} ${height * 0.5} ${flip * 34} ${height * 0.42} ${flip * 42} ${height * 0.36} C ${flip * 40} ${height * 0.7} ${flip * 26} ${height * 0.92} ${flip * 2} ${height * 0.9} Z`,
      )!,
    [height, flip],
  );
  const vein = useMemo(
    () => Skia.Path.MakeFromSVGString(`M ${flip * 10} ${height * 0.78} Q ${flip * 22} ${height * 0.62} ${flip * 34} ${height * 0.46}`)!,
    [height, flip],
  );
  return (
    <>
      <Path path={stem} style="stroke" strokeWidth={7} strokeCap="round" color={color} />
      <Path path={leaf} color={leafColor} />
      <Path path={vein} style="stroke" strokeWidth={ink} strokeCap="round" color={lineColor} />
    </>
  );
}

/** Wide open daisy, seen a little from above. */
function Daisy({ petal, centre, line, stem }: { petal: string; centre: string; line: string; stem: string }) {
  return (
    <>
      <Stem height={92} color={stem} leafColor={stem} lineColor={line} />
      <Oval x={-44} y={-26} width={88} height={52} color={petal} />
      <Spokes cx={0} cy={0} rx={44} ry={26} count={9} color={line} />
      <Oval x={-15} y={-9} width={30} height={18} color={centre} />
    </>
  );
}

const PETALS = Array.from({ length: 6 }, (_, i) => (i / 6) * 360);

/** Six fat petals around a small centre. */
function Bloom({ petal, centre, stem, line }: { petal: string; centre: string; stem: string; line: string }) {
  return (
    <>
      <Stem height={88} color={stem} leafColor={stem} lineColor={line} flip={-1} />
      {PETALS.map((deg) => (
        <Group key={deg} transform={[{ rotate: (deg * Math.PI) / 180 }]}>
          <Oval x={-13} y={-40} width={26} height={36} color={petal} />
        </Group>
      ))}
      <Oval x={-13} y={-8} width={26} height={16} color={centre} />
    </>
  );
}

const tulip = Skia.Path.MakeFromSVGString(
  'M -26 -8 L -13 -2 L -8 -24 L 4 -6 L 20 -26 C 30 -4 28 22 2 26 C -22 28 -30 12 -26 -8 Z',
)!;

/** A cup-shaped tulip with a couple of anthers peeking out. */
function Tulip({ cup, stem, line, tip, tip2 }: { cup: string; stem: string; line: string; tip: string; tip2: string }) {
  return (
    <>
      <Stem height={76} color={stem} leafColor={stem} lineColor={line} />
      <Circle cx={-7} cy={-14} r={5} color={tip} />
      <Circle cx={8} cy={-20} r={4} color={tip2} />
      <Path path={tulip} color={cup} />
    </>
  );
}

type FlowerSpot = { page: number; x: number; lift: number; kind: 'daisy' | 'bloom' | 'tulip' | 'sunflower'; scale: number };

/** Two per page, either side of the page's character. `x` is a share of the screen width. */
const FLOWERS: FlowerSpot[] = [
  { page: 0, x: 0.1, lift: 76, kind: 'daisy', scale: 0.74 },
  { page: 0, x: 0.9, lift: 66, kind: 'tulip', scale: 0.84 },
  { page: 1, x: 0.1, lift: 72, kind: 'bloom', scale: 0.82 },
  { page: 1, x: 0.88, lift: 74, kind: 'sunflower', scale: 0.72 },
  { page: 2, x: 0.08, lift: 68, kind: 'tulip', scale: 0.8 },
  { page: 2, x: 0.9, lift: 76, kind: 'bloom', scale: 0.76 },
  { page: 3, x: 0.12, lift: 66, kind: 'sunflower', scale: 0.74 },
  { page: 3, x: 0.86, lift: 76, kind: 'daisy', scale: 0.78 },
];

type FlowerProps = {
  spot: FlowerSpot;
  width: number;
  colors: ColorTokens;
  sway: SharedValue<number>;
  rise: SharedValue<number>;
  progress: SharedValue<number>;
};

function Flower({ spot, width, colors, sway, rise, progress }: FlowerProps) {
  const x = (spot.page * FIELD.mid.parallax + spot.x) * width;
  // Tucked behind the hill at rest so nothing sits over the content; they grow as their page's field rises.
  const transform = useDerivedValue(() => {
    const here = Math.max(1 - Math.abs(progress.get() - spot.page) * 2.5, 0);
    const grown = rise.get() * here;
    return [
      { translateX: x },
      { translateY: 40 + (1 - grown) * 50 - spot.lift * grown },
      { scale: spot.scale * (0.72 + 0.28 * grown) },
      { rotate: sway.get() },
    ];
  });
  const stem = colors.hillFront;
  const line = colors.fieldInk;
  return (
    <Group transform={transform}>
      {spot.kind === 'daisy' ? <Daisy petal={colors.mood} centre={colors.ribbonSun} line={line} stem={stem} /> : null}
      {spot.kind === 'sunflower' ? <Daisy petal={colors.ribbonSun} centre={colors.ribbonSky} line={line} stem={stem} /> : null}
      {spot.kind === 'bloom' ? <Bloom petal={colors.ribbonCoral} centre={colors.mood} stem={stem} line={line} /> : null}
      {spot.kind === 'tulip' ? (
        <Tulip cup={colors.ribbonSun} stem={stem} line={line} tip={colors.ribbonSky} tip2={colors.ribbonCoral} />
      ) : null}
    </Group>
  );
}

/** One character per page stands behind the middle hill and climbs out when that page reaches its end. */
const FIELD_CHARACTERS = [
  { name: 'shrug', page: 0, x: 0.34, height: 190 },
  { name: 'cheer', page: 1, x: 0.42, height: 200 },
  { name: 'skip', page: 2, x: 0.3, height: 190 },
  { name: 'leap', page: 3, x: 0.3, height: 190 },
] as const;

/** How far a character shows above the hill when it is fully out. */
const CHARACTER_PEEK = 118;

type FieldCharacterProps = {
  spec: (typeof FIELD_CHARACTERS)[number];
  width: number;
  rise: SharedValue<number>;
  progress: SharedValue<number>;
};

function FieldCharacter({ spec, width, rise, progress }: FieldCharacterProps) {
  const art = ART[spec.name];
  const image = useImage(art.source);
  const w = spec.height * art.ratio;
  const x = (spec.page * FIELD.mid.parallax + spec.x) * width - w * 0.2;
  const transform = useDerivedValue(() => {
    const here = Math.max(1 - Math.abs(progress.get() - spec.page) * 2.5, 0);
    return [{ translateY: 40 - CHARACTER_PEEK * rise.get() * here }];
  });
  return (
    <Group transform={transform}>
      <Image image={image} x={x} y={0} width={w} height={spec.height} fit="contain" />
    </Group>
  );
}

/** The band of cloud along the top of the screen, so scrolled content never runs under the status bar. */
function cloudPath(length: number, depth: number) {
  const rand = seeded(23);
  let x = -60;
  let d = `M ${x} -200 L ${x} ${depth}`;
  while (x < length) {
    const w = 46 + rand() * 74;
    const h = 8 + rand() * 12;
    const nx = x + w;
    d += ` C ${x + w * 0.1} ${depth + h * 1.5} ${nx - w * 0.1} ${depth + h * 1.5} ${nx} ${depth}`;
    x = nx;
  }
  d += ` L ${x} -200 Z`;
  return Skia.Path.MakeFromSVGString(d)!;
}

type CloudsProps = {
  colors: ColorTokens;
  width: number;
  topInset: number;
  progress: SharedValue<number>;
  scrollY: SharedValue<number>;
};

/** Slides down over the status bar as a page scrolls away from its top, and away again when it returns. */
export function Clouds({ colors, width, topInset, progress, scrollY }: CloudsProps) {
  const depth = topInset + 2;
  const path = useMemo(() => cloudPath(width * (WORLD_PAGES + 1), depth), [width, depth]);
  const transform = useDerivedValue(() => {
    const shown = Math.min(Math.max(scrollY.get() / 44, 0), 1);
    return [{ translateX: -progress.get() * width * 0.3 }, { translateY: -(depth + 26) * (1 - shown) }];
  });
  return (
    <Group transform={transform}>
      <Path path={path} color={colors.canvas} />
    </Group>
  );
}

type FieldProps = {
  /** Passed in: React context doesn't reach inside a Skia canvas. */
  colors: ColorTokens;
  width: number;
  height: number;
  bottomInset: number;
  progress: SharedValue<number>;
  rise: SharedValue<number>;
  lift: SharedValue<number>;
  /** Eased, so the hills settle rather than snap. */
  sway: SharedValue<number>;
};

/**
 * Hills along the bottom of the world. They sit in front of the content, so cards slide behind them, and
 * they grow when a page reaches its end.
 */
export function Field({ colors, width, height, bottomInset, progress, rise, lift, sway }: FieldProps) {
  const length = width * (WORLD_PAGES + 1);
  const hills = useMemo(
    () => ({
      back: hillPath(11, length, [90, 170], [38, 58]),
      mid: hillPath(37, length, [120, 210], [30, 44]),
      front: hillPath(59, length, [180, 300], [16, 26]),
    }),
    [length],
  );

  const place = (spec: HillLayer, p: number, r: number, l: number) => {
    'worklet';
    const top = height - bottomInset - spec.rest - (spec.risen - spec.rest) * r;
    return [{ translateX: -p * width * spec.parallax }, { translateY: top + l * (spec.rest + 60 + bottomInset) }];
  };

  // The shared values are read here, not inside `place`: Reanimated only tracks what a worklet reads directly.
  const back = useDerivedValue(() => place(FIELD.back, progress.get(), rise.get(), lift.get()));
  const mid = useDerivedValue(() => place(FIELD.mid, progress.get(), rise.get(), lift.get()));
  const front = useDerivedValue(() => place(FIELD.front, progress.get(), rise.get(), lift.get()));

  return (
    <>
      <Group transform={back}>
        <Path path={hills.back} color={colors.hillBack} />
      </Group>
      <Group transform={mid}>
        {FIELD_CHARACTERS.map((c) => (
          <FieldCharacter key={`${c.name}-${c.page}`} spec={c} width={width} rise={rise} progress={progress} />
        ))}
        {FLOWERS.map((spot) => (
          <Flower key={`${spot.page}-${spot.x}`} spot={spot} width={width} colors={colors} sway={sway} rise={rise} progress={progress} />
        ))}
        <Path path={hills.mid} color={colors.hillMid} />
      </Group>
      <Group transform={front}>
        <Path path={hills.front} color={colors.hillFront} />
      </Group>
    </>
  );
}
