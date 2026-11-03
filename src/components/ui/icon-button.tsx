import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { border, radius, useTheme } from '@/theme';

import { pressStyles, type IconName } from './button';

type IconButtonProps = {
  icon: IconName;
  /** Read by screen readers — the button has no visible text. */
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function IconButton({ icon, label, onPress, disabled }: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: colors.surface, borderColor: colors.line },
        pressed && !disabled ? pressStyles.pressed : pressStyles.raised,
      ]}>
      <Ionicons name={icon} size={22} color={disabled ? colors.textMuted : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 46,
    height: 46,
    borderRadius: radius.control,
    borderWidth: border.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
