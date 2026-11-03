import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { typeScale, useTheme, type ColorTokens, type TypeVariant } from '@/theme';

export type TextTone =
  | 'default'
  | 'strong'
  | 'secondary'
  | 'muted'
  | 'link'
  | 'period'
  | 'onPrimary'
  | 'onPeriod'
  | 'onInverse'
  | 'inverseAction';

const toneColor: Record<TextTone, keyof ColorTokens> = {
  default: 'text',
  strong: 'textStrong',
  secondary: 'textSecondary',
  muted: 'textMuted',
  link: 'link',
  period: 'period',
  onPrimary: 'onPrimary',
  onPeriod: 'onPeriod',
  onInverse: 'onInverse',
  inverseAction: 'inverseAction',
};

export type TextProps = RNTextProps & {
  variant?: TypeVariant;
  tone?: TextTone;
  align?: 'left' | 'center' | 'right';
};

export function Text({ variant = 'body', tone = 'default', align, style, ...rest }: TextProps) {
  const { colors } = useTheme();
  const isDisplay = variant === 'display' || variant === 'displaySm';
  return (
    <RNText
      // Big numerals stay readable without breaking the layout; body text scales to 200%.
      maxFontSizeMultiplier={isDisplay ? 1.3 : 2}
      {...rest}
      style={[
        typeScale[variant],
        { color: colors[toneColor[tone]] },
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}
