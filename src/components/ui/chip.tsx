import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { fonts, radius, space, useTheme, type ColorTokens } from '@/theme';

import { Text } from './text';

/** Which log category the chip belongs to; each fills with its own colour when selected. */
export type ChipCategory = 'neutral' | 'symptom' | 'mood' | 'period';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  /** `radio` for one-of-many choices, `checkbox` for toggles, `button` for plain actions. */
  role?: 'checkbox' | 'radio' | 'button';
  category?: ChipCategory;
  leading?: ReactNode;
  disabled?: boolean;
  accessibilityHint?: string;
};

function selectedFill(colors: ColorTokens, category: ChipCategory) {
  switch (category) {
    case 'symptom':
      return { fill: colors.symptom, ink: colors.onSymptom };
    case 'mood':
      return { fill: colors.mood, ink: colors.onMood };
    case 'period':
      return { fill: colors.period, ink: colors.onPeriod };
    case 'neutral':
      return { fill: colors.structure, ink: colors.onStructure };
  }
}

/** Soft pill toggle. Selection changes the fill and adds a check mark, so it never relies on colour alone. */
export function Chip({
  label,
  selected = false,
  onPress,
  role = 'checkbox',
  category = 'neutral',
  leading,
  disabled,
  accessibilityHint,
}: ChipProps) {
  const { colors } = useTheme();
  const on = selectedFill(colors, category);
  const fill = selected ? (disabled ? colors.surfaceAlt : on.fill) : colors.canvas;
  const ink = disabled ? colors.textSecondary : selected ? on.ink : colors.ink;

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
      hitSlop={2}
      style={({ pressed }) => [styles.base, { backgroundColor: fill }, pressed && styles.pressed]}>
      {selected ? <Ionicons name="checkmark" size={16} color={ink} /> : null}
      {leading}
      <Text style={[styles.label, { color: ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: radius.full,
    paddingHorizontal: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pressed: { transform: [{ scale: 0.96 }] },
  label: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20 },
});
