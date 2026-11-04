/**
 * Design tokens — the source of truth is DESIGN.md ("Paper meadow").
 *
 * Direction: refero MindMarket style — cream paper canvas, white sticker cards, Inter only, generous rounding,
 * no shadows. Colour is decoration, not status. Every text pair is WCAG AA in both themes (DESIGN.md §4).
 */
import type { TextStyle } from 'react-native';

export const palette = {
  creamPaper: '#f5f1e4',
  pureWhite: '#ffffff',
  sandstone: '#e0dbce',
  hairlineMist: '#d5d5d4',
  /** Stone Gray from the style doc is 3.4:1 on cream, so text uses this deeper step instead. */
  deepStone: '#60625e',
  inkBlack: '#2c2e2a',
  freshGrass: '#8ed462',
  skyPop: '#2ba0ff',
  coralPop: '#ff705d',
  sunshinePop: '#f5e211',
  /** Sampled from the reference illustrations. */
  lilac: '#e8c0fc',
  meadow: '#79c14d',
  forest: '#65a936',
  /** Coral deep enough to work as a line or text on cream and white. */
  emberCoral: '#c9361f',
} as const;

export type ColorTokens = {
  canvas: string;
  /** Cards, nav, sheets. White on cream, never white on white. */
  surface: string;
  /** Recessed: inset wells, ring tracks, tracks of segmented controls. */
  surfaceAlt: string;
  line: string;
  ink: string;
  textSecondary: string;
  /** The primary action fill, with `onAction` text. */
  action: string;
  onAction: string;
  /** The small circle at the end of every button. */
  actionDot: string;
  /** Structural green: the nav blob, chart bars, the circle on secondary buttons. */
  structure: string;
  onStructure: string;
  period: string;
  onPeriod: string;
  /** Period as a thin line or as text: prediction outlines, ring arcs. */
  periodLine: string;
  periodWash: string;
  symptom: string;
  onSymptom: string;
  mood: string;
  onMood: string;
  scrim: string;
  /** Ribbons and field. */
  ribbonGrass: string;
  ribbonGrassShade: string;
  ribbonSky: string;
  ribbonSkyShade: string;
  ribbonCoral: string;
  ribbonCoralShade: string;
  ribbonSun: string;
  ribbonSunShade: string;
  onRibbonSun: string;
  hillBack: string;
  hillMid: string;
  hillFront: string;
  fieldInk: string;
};

export const lightColors: ColorTokens = {
  canvas: palette.creamPaper,
  surface: palette.pureWhite,
  surfaceAlt: palette.sandstone,
  line: palette.hairlineMist,
  ink: palette.inkBlack,
  textSecondary: palette.deepStone,
  action: palette.sunshinePop,
  onAction: palette.inkBlack,
  actionDot: palette.pureWhite,
  structure: palette.freshGrass,
  onStructure: palette.inkBlack,
  period: palette.coralPop,
  onPeriod: palette.inkBlack,
  periodLine: palette.emberCoral,
  periodWash: '#ffe2dc',
  symptom: palette.skyPop,
  onSymptom: palette.inkBlack,
  mood: palette.lilac,
  onMood: palette.inkBlack,
  scrim: 'rgba(44, 46, 42, 0.32)',
  ribbonGrass: palette.freshGrass,
  ribbonGrassShade: '#378e43',
  ribbonSky: palette.skyPop,
  ribbonSkyShade: '#1a72bb',
  ribbonCoral: palette.coralPop,
  ribbonCoralShade: '#c94a39',
  ribbonSun: palette.sunshinePop,
  ribbonSunShade: '#ddcb1a',
  onRibbonSun: palette.inkBlack,
  hillBack: palette.forest,
  hillMid: palette.meadow,
  hillFront: palette.freshGrass,
  fieldInk: palette.inkBlack,
};

/** Night meadow: the style doc has no dark theme, so these are ours. Ribbons drop a step so they don't glare. */
export const darkColors: ColorTokens = {
  canvas: '#1f231c',
  surface: '#2b3026',
  surfaceAlt: '#3a4034',
  line: '#474e40',
  ink: palette.creamPaper,
  textSecondary: '#b9bcb1',
  action: palette.sunshinePop,
  onAction: palette.inkBlack,
  actionDot: palette.pureWhite,
  structure: palette.freshGrass,
  onStructure: palette.inkBlack,
  period: palette.coralPop,
  onPeriod: palette.inkBlack,
  periodLine: '#ff8b7b',
  periodWash: '#4a2a24',
  symptom: palette.skyPop,
  onSymptom: palette.inkBlack,
  mood: palette.lilac,
  onMood: palette.inkBlack,
  scrim: 'rgba(0, 0, 0, 0.5)',
  ribbonGrass: '#4f8f3a',
  ribbonGrassShade: '#2c5a26',
  ribbonSky: '#2384d4',
  ribbonSkyShade: '#14558c',
  ribbonCoral: '#e0604f',
  ribbonCoralShade: '#9c3a2e',
  ribbonSun: '#d9c814',
  ribbonSunShade: '#9c8f12',
  onRibbonSun: palette.inkBlack,
  hillBack: '#2f5426',
  hillMid: '#3a6a2e',
  hillFront: '#4a8038',
  fieldInk: '#1b1e18',
};

/** Inter only, regular and medium. No second typeface, no bold. */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
} as const;

const track = (size: number, em: number) => Math.round(size * em * 100) / 100;

/** The style doc's scale, stepped down for a phone: 53px stays the floor for page headings. */
export const typeScale = {
  display: { fontFamily: fonts.medium, fontSize: 72, lineHeight: 72, letterSpacing: track(72, -0.06) },
  headingLg: { fontFamily: fonts.medium, fontSize: 53, lineHeight: 58, letterSpacing: track(53, -0.04) },
  heading: { fontFamily: fonts.medium, fontSize: 40, lineHeight: 44, letterSpacing: track(40, -0.04) },
  headingSm: { fontFamily: fonts.medium, fontSize: 30, lineHeight: 36, letterSpacing: track(30, -0.03) },
  subheading: { fontFamily: fonts.medium, fontSize: 20, lineHeight: 25, letterSpacing: track(20, -0.01) },
  paragraph: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22 },
  button: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22 },
  label: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof typeScale;

/** 4px grid. */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** Sticker-soft everywhere; nothing below 10. */
export const radius = {
  small: 10,
  inset: 22,
  card: 50,
  full: 999,
} as const;

export const size = {
  touch: 44,
  button: 60,
  buttonDot: 44,
  nav: 64,
  navItem: 48,
} as const;

/** Content column width on tablets and the web preview. */
export const maxContentWidth = 560;

/**
 * A full-bleed Skia canvas that touches pass through. One plain object, with pointerEvents in the style,
 * because the web build of `Canvas` takes neither style arrays nor the pointerEvents prop.
 */
export const canvasOverlay = {
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
} as const;

/** The gutter between the screen edge and any card. */
export const gutter = space[4];
