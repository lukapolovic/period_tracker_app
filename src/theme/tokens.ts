/**
 * Design tokens.
 *
 * Direction: refero "playful storybook" style — white canvas, rounded display type, flat fills,
 * thick 2px borders, 12px radius, no shadows or gradients, one saturated green for actions.
 * Deviations from the reference, all for WCAG AA (MARKET_ANALYSIS.md F-14):
 * - Text on the green fill is Night Ink, not white (white on #58cc02 is only 2.1:1).
 * - Pencil Gray is #767676 instead of #777777 (4.5:1 on white).
 * - Link text uses a deeper Spark Blue (#0a7bb8); the bright one is kept for borders and fills.
 * Period data gets its own berry hue so it never competes with the action green.
 */
import type { TextStyle } from 'react-native';

export const palette = {
  eagerGreen: '#58cc02',
  eagerGreenLip: '#46a302',
  storybookGreen: '#d7ffb8',
  freshLeaf: '#a5ed6e',
  sparkBlue: '#1cb0f6',
  sparkBlueText: '#0a7bb8',
  sparkBlueWash: '#ddf4ff',
  nightInk: '#000437',
  paperWhite: '#ffffff',
  charcoal: '#4b4b4b',
  pencilGray: '#767676',
  fadedGray: '#afafaf',
  cloud: '#e5e5e5',
  mist: '#f7f7f7',
  berry: '#d1325b',
  berryLip: '#a8264a',
  berryWash: '#ffe3ea',
} as const;

export type ColorTokens = {
  canvas: string;
  surface: string;
  surfaceAlt: string;
  line: string;
  lineStrong: string;
  text: string;
  textStrong: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLip: string;
  onPrimary: string;
  primaryWash: string;
  link: string;
  linkBorder: string;
  linkWash: string;
  period: string;
  periodLip: string;
  onPeriod: string;
  periodWash: string;
  inverseSurface: string;
  onInverse: string;
  inverseAction: string;
};

export const lightColors: ColorTokens = {
  canvas: palette.paperWhite,
  surface: palette.paperWhite,
  surfaceAlt: palette.mist,
  line: palette.cloud,
  lineStrong: palette.fadedGray,
  text: palette.charcoal,
  textStrong: palette.nightInk,
  textSecondary: palette.pencilGray,
  textMuted: palette.fadedGray,
  primary: palette.eagerGreen,
  primaryLip: palette.eagerGreenLip,
  onPrimary: palette.nightInk,
  primaryWash: palette.storybookGreen,
  link: palette.sparkBlueText,
  linkBorder: palette.sparkBlue,
  linkWash: palette.sparkBlueWash,
  period: palette.berry,
  periodLip: palette.berryLip,
  onPeriod: palette.paperWhite,
  periodWash: palette.berryWash,
  inverseSurface: palette.nightInk,
  onInverse: palette.paperWhite,
  inverseAction: palette.freshLeaf,
};

/** Dark mode is derived from Night Ink so it stays on-palette. */
export const darkColors: ColorTokens = {
  canvas: '#0a0f2e',
  surface: '#121842',
  surfaceAlt: '#1a2150',
  line: '#2a3263',
  lineStrong: '#4a5288',
  text: '#e9ebff',
  textStrong: '#ffffff',
  textSecondary: '#b4b8dc',
  textMuted: '#7c82b3',
  primary: palette.eagerGreen,
  primaryLip: '#3f9400',
  onPrimary: palette.nightInk,
  primaryWash: '#1d3a16',
  link: '#4fc3ff',
  linkBorder: palette.sparkBlue,
  linkWash: '#10304d',
  period: '#ff7a9a',
  periodLip: '#d9577a',
  onPeriod: '#0a0f2e',
  periodWash: '#3d1a3a',
  inverseSurface: '#e9ebff',
  onInverse: '#0a0f2e',
  inverseAction: '#2f6b00',
};

/** Rounded display face only at 48px+, per the reference; everything else is Nunito Sans. */
export const fonts = {
  display: 'Nunito_900Black',
  body: 'NunitoSans_500Medium',
  semibold: 'NunitoSans_600SemiBold',
  bold: 'NunitoSans_700Bold',
  heavy: 'NunitoSans_800ExtraBold',
} as const;

export const typeScale = {
  display: { fontFamily: fonts.display, fontSize: 64, lineHeight: 72, letterSpacing: -1.28 },
  displaySm: { fontFamily: fonts.display, fontSize: 48, lineHeight: 56, letterSpacing: -0.96 },
  title: { fontFamily: fonts.heavy, fontSize: 30, lineHeight: 36 },
  heading: { fontFamily: fonts.heavy, fontSize: 22, lineHeight: 28 },
  subheading: { fontFamily: fonts.bold, fontSize: 19, lineHeight: 26 },
  body: { fontFamily: fonts.body, fontSize: 17, lineHeight: 23 },
  bodyBold: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 23 },
  label: {
    fontFamily: fonts.heavy,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  caption: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 17 },
  eyebrow: {
    fontFamily: fonts.heavy,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof typeScale;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
} as const;

export const radius = {
  control: 12,
  card: 16,
  sheet: 24,
  pill: 999,
} as const;

export const border = {
  width: 2,
  lip: 4,
} as const;

/** Content column width on tablets and the web preview. */
export const maxContentWidth = 560;
