import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { radius, size, useTheme } from '@/theme';

import type { IconName } from './button';

type IconButtonProps = {
  icon: IconName;
  /** Read by screen readers — the button has no visible text. */
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** `surface` on the canvas, `inset` inside a white card. */
  tone?: 'surface' | 'inset';
};

export function IconButton({ icon, label, onPress, disabled, tone = 'surface' }: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: tone === 'inset' ? colors.canvas : colors.surface },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <Ionicons name={icon} size={22} color={disabled ? colors.textSecondary : colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: size.touch,
    height: size.touch,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.92 }] },
});
