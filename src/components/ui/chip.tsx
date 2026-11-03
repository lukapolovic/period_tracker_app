import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { border, radius, space, useTheme } from '@/theme';

import { pressStyles } from './button';
import { Text } from './text';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  /** `radio` for one-of-many choices, `checkbox` for toggles, `button` for plain actions. */
  role?: 'checkbox' | 'radio' | 'button';
  tone?: 'default' | 'period';
  leading?: ReactNode;
  disabled?: boolean;
  accessibilityHint?: string;
};

/** Toggle pill. Selection is shown by fill, border and a check mark — never by colour alone. */
export function Chip({
  label,
  selected = false,
  onPress,
  role = 'checkbox',
  tone = 'default',
  leading,
  disabled,
  accessibilityHint,
}: ChipProps) {
  const { colors } = useTheme();
  const on =
    tone === 'period'
      ? { fill: colors.periodWash, edge: colors.period, lip: colors.periodLip, mark: colors.period }
      : { fill: colors.linkWash, edge: colors.linkBorder, lip: colors.linkBorder, mark: colors.link };
  const c = selected ? on : { fill: colors.surface, edge: colors.line, lip: colors.line, mark: colors.text };

  return (
    <Pressable
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={
        role === 'radio' ? { selected, disabled } : role === 'checkbox' ? { checked: selected, disabled } : { disabled }
      }
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: c.fill, borderColor: c.edge, borderBottomColor: c.lip },
        pressed && !disabled ? pressStyles.pressed : pressStyles.raised,
        disabled && styles.disabled,
      ]}>
      {selected ? <Ionicons name="checkmark" size={18} color={c.mark} /> : null}
      {leading}
      <Text variant="bodyBold" tone={selected ? 'strong' : 'default'} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 46,
    borderRadius: radius.control,
    borderWidth: border.width,
    paddingHorizontal: space.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
  },
  label: { fontSize: 15, lineHeight: 20 },
  disabled: { opacity: 0.45 },
});
