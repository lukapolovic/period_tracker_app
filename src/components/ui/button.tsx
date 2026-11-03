import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { border, radius, space, useTheme, type ColorTokens } from '@/theme';

import { Text } from './text';

export type IconName = ComponentProps<typeof Ionicons>['name'];

type Variant = 'primary' | 'secondary' | 'period' | 'danger';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

function look(colors: ColorTokens, variant: Variant, disabled?: boolean) {
  if (disabled) {
    return { fill: colors.line, edge: colors.line, lip: colors.line, text: colors.textMuted };
  }
  switch (variant) {
    case 'primary':
      return { fill: colors.primary, edge: colors.primary, lip: colors.primaryLip, text: colors.onPrimary };
    case 'period':
      return { fill: colors.period, edge: colors.period, lip: colors.periodLip, text: colors.onPeriod };
    case 'danger':
      return { fill: colors.surface, edge: colors.period, lip: colors.period, text: colors.period };
    case 'secondary':
      return { fill: colors.surface, edge: colors.line, lip: colors.line, text: colors.link };
  }
}

/** Flat, thick-bordered button whose bottom "lip" collapses when pressed. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  accessibilityHint,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const c = look(colors, variant, disabled);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: c.fill, borderColor: c.edge, borderBottomColor: c.lip },
        pressed ? styles.pressed : styles.raised,
        style,
      ]}>
      {icon ? <Ionicons name={icon} size={20} color={c.text} /> : null}
      <Text variant="label" style={{ color: c.text }}>
        {label}
      </Text>
    </Pressable>
  );
}

type TextButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  tone?: 'link' | 'secondary' | 'period';
  accessibilityHint?: string;
};

/** Low-emphasis action: coloured label, no box. */
export function TextButton({ label, onPress, icon, tone = 'link', accessibilityHint }: TextButtonProps) {
  const { colors } = useTheme();
  const color = tone === 'link' ? colors.link : tone === 'period' ? colors.period : colors.textSecondary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.textButton, pressed && { opacity: 0.6 }]}>
      {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
      <Text variant="label" style={{ color }}>
        {label}
      </Text>
    </Pressable>
  );
}

export const pressStyles = StyleSheet.create({
  raised: { borderBottomWidth: border.lip, marginTop: 0 },
  pressed: { borderBottomWidth: border.width, marginTop: border.lip - border.width },
});

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.control,
    borderWidth: border.width,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  ...pressStyles,
  textButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    paddingHorizontal: space.sm,
  },
});
