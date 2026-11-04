/**
 * The shapes of the ribbons.
 *
 * Every ribbon is a spline through a few points. x is measured in screen widths, y in screen heights.
 * A ribbon's `parallax` is how many screen widths it travels per page of panning: below 1 it sits behind
 * the content, above 1 it rushes past in front of it.
 */
import type { ColorTokens } from '@/theme';

export type RibbonPoint = readonly [x: number, y: number];

/** A stretch of a ribbon, as control point indices. */
export type RibbonSpan = {
  from: number;
  to: number;
  /** Draw this stretch over the content instead of behind it. */
  front?: boolean;
  /** Tuck this stretch under the rest of the ribbon, shaded, so the crossing reads as a real overlap. */
  shaded?: boolean;
};

export type RibbonSpec = {
  key: string;
  color: keyof ColorTokens;
  shade: keyof ColorTokens;
  /** Fraction of the screen width. */
  width: number;
  parallax: number;
  scrollParallax: number;
  /** Spring stiffness: lower lags further behind and bends more. */
  stiffness: number;
  /** How much lag turns into sideways bend. */
  bend: number;
  points: RibbonPoint[];
  spans: RibbonSpan[];
};

/** Line width of the big ribbon, as a fraction of the screen width. */
const BIG = 0.44;

export const RIBBONS: RibbonSpec[] = [
  {
    key: 'grass',
    color: 'ribbonGrass',
    shade: 'ribbonGrassShade',
    width: BIG,
    parallax: 0.62,
    scrollParallax: 0.42,
    stiffness: 58,
    bend: 0.5,
    points: [
      [-0.72, -0.2],
      [-0.28, 0.02],
      [0.2, 0.1],
      [0.66, 0.2],
      [1.02, 0.46],
      [1.02, 0.82],
      [1.28, 1.08],
      [1.6, 0.98],
      [1.72, 0.62],
      [1.66, 0.3],
      [1.32, 0.2],
      [1.1, 0.38],
      // The big loop: from here the line crosses back over itself on its way to History.
      [1.3, 0.56],
      [1.76, 0.5],
      [2.14, 0.26],
      [2.5, 0.2],
      [2.68, 0.5],
      [2.66, 0.86],
      [2.96, 1.1],
      [3.34, 0.86],
      [3.7, 0.6],
    ],
    spans: [
      { from: 0, to: 7 },
      { from: 7, to: 11, shaded: true },
      { from: 11, to: 20 },
    ],
  },
  {
    key: 'sun',
    color: 'ribbonSun',
    shade: 'ribbonSunShade',
    width: 0.05,
    parallax: 0.74,
    scrollParallax: 0.56,
    stiffness: 74,
    bend: 0.6,
    points: [
      [-0.4, 0.74],
      [-0.06, 0.62],
      [0.26, 0.78],
      [0.6, 1.02],
      [1.0, 0.98],
      [1.26, 0.72],
      [1.5, 0.74],
      [1.74, 0.98],
      [2.12, 0.96],
      [2.4, 0.66],
      [2.56, 0.34],
      [2.92, 0.26],
      [3.18, 0.5],
      [3.6, 0.5],
    ],
    spans: [{ from: 0, to: 13 }],
  },
  {
    key: 'sky',
    color: 'ribbonSky',
    shade: 'ribbonSkyShade',
    width: 0.07,
    parallax: 0.86,
    scrollParallax: 0.7,
    stiffness: 96,
    bend: 0.72,
    points: [
      [-0.3, 0.32],
      [0.04, 0.4],
      [0.1, 0.62],
      [0.0, 0.88],
      [0.34, 1.06],
      [0.8, 0.82],
      [0.98, 0.44],
      [1.3, 0.16],
      [1.7, 0.14],
      [1.96, 0.42],
      [2.0, 0.78],
      [2.34, 0.98],
      [2.74, 0.78],
      [2.96, 0.42],
      [3.3, 0.22],
      [3.7, 0.3],
    ],
    spans: [{ from: 0, to: 15 }],
  },
  {
    key: 'coral',
    color: 'ribbonCoral',
    shade: 'ribbonCoralShade',
    width: 0.036,
    parallax: 0.96,
    scrollParallax: 0.86,
    stiffness: 120,
    bend: 0.85,
    points: [
      [-0.3, -0.04],
      [0.16, 0.02],
      [0.56, -0.02],
      [0.98, 0.14],
      [1.0, 0.42],
      [0.96, 0.7],
      [1.26, 0.9],
      [1.7, 0.78],
      [2.02, 0.84],
      [2.32, 0.6],
      [2.1, 0.32],
      [2.3, 0.1],
      [2.72, 0.04],
      [3.1, 0.2],
      [3.1, 0.56],
      [3.4, 0.8],
      [3.9, 0.7],
    ],
    spans: [{ from: 0, to: 16 }],
  },
];

/**
 * One curl of ribbon per gap between pages, tied around the content like string around a parcel: one strand
 * runs behind the cards, the other over them with a knot in it. They travel faster than the content, so they
 * are off screen whenever a page is at rest and only cross it mid-pan. Both strands start and end off screen,
 * so nothing ever appears to change depth in the middle of a card.
 */
const KNOT_PARALLAX = 1.8;
const knotCentre = (gap: number) => KNOT_PARALLAX * (gap + 0.5) + 0.5;

const KNOT_OVER: RibbonPoint[] = [
  [0.02, -0.26],
  [-0.02, 0.08],
  [-0.05, 0.32],
  [0.05, 0.56],
  [0.23, 0.68],
  [0.33, 0.5],
  [0.2, 0.3],
  [-0.07, 0.26],
  [-0.3, 0.36],
  [-0.31, 0.6],
  [-0.14, 0.86],
  [-0.03, 1.3],
];

const KNOT_UNDER: RibbonPoint[] = [
  [0.3, -0.26],
  [0.27, 0.1],
  [0.1, 0.4],
  [0.2, 0.72],
  [0.3, 1.0],
  [0.2, 1.3],
];

function knot(gap: number, key: string, color: keyof ColorTokens, shade: keyof ColorTokens): RibbonSpec[] {
  const flip = gap % 2 === 0 ? 1 : -1;
  const place = (points: RibbonPoint[]) => points.map(([x, y]) => [knotCentre(gap) + x * flip, y] as const);
  const shared = { color, shade, width: 0.07, parallax: KNOT_PARALLAX, scrollParallax: 0, bend: 0.5 };
  return [
    { ...shared, key: `${key}-under`, stiffness: 90, points: place(KNOT_UNDER), spans: [{ from: 0, to: 5 }] },
    {
      ...shared,
      key: `${key}-over`,
      stiffness: 110,
      points: place(KNOT_OVER),
      spans: [
        { from: 0, to: 4, front: true },
        { from: 4, to: 8, front: true, shaded: true },
        { from: 8, to: 11, front: true },
      ],
    },
  ];
}

export const KNOTS: RibbonSpec[] = [
  ...knot(0, 'knot-sky', 'ribbonSky', 'ribbonSkyShade'),
  ...knot(1, 'knot-coral', 'ribbonCoral', 'ribbonCoralShade'),
  ...knot(2, 'knot-sun', 'ribbonSun', 'ribbonSunShade'),
];

export const ALL_RIBBONS = [...RIBBONS, ...KNOTS];

/** Each ribbon's first point in the flattened arrays. */
export function ribbonOffsets(specs: RibbonSpec[]): number[] {
  const offsets: number[] = [];
  let at = 0;
  for (const spec of specs) {
    offsets.push(at);
    at += spec.points.length;
  }
  return offsets;
}
