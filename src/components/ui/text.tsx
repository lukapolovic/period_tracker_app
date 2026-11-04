import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { typeScale, useTheme, type ColorTokens, type TypeVariant } from '@/theme';

export type TextTone = 'default' | 'secondary' | 'period' | 'onAction' | 'onPeriod' | 'inverse';

const toneColor: Record<TextTone, keyof ColorTokens> = {
  default: 'ink',
  secondary: 'textSecondary',
  period: 'periodLine',
  onAction: 'onAction',
  onPeriod: 'onPeriod',
  // Text on an ink fill (the snackbar): the canvas colour reads in both themes.
  inverse: 'canvas',
};

export type TextProps = RNTextProps & {
  variant?: TypeVariant;
  tone?: TextTone;
  align?: 'left' | 'center' | 'right';
};

export function Text({ variant = 'body', tone = 'default', align, style, ...rest }: TextProps) {
  const { colors } = useTheme();
  return (
    <RNText
      // Display type stays inside its shapes; everything else scales to 200%.
      maxFontSizeMultiplier={variant === 'display' ? 1 : variant === 'headingLg' ? 1.3 : 2}
      {...rest}
      style={[typeScale[variant], { color: colors[toneColor[tone]] }, align ? { textAlign: align } : null, style]}
    />
  );
}
