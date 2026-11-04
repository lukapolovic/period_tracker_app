import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { FLOWS } from '@/constants/log-options';
import type { Flow } from '@/lib/cycle';
import { fonts, radius, space, useTheme } from '@/theme';

/** 0–3 drops, so the level never depends on colour; spotting is an outlined drop. */
function Drops({ count, color }: { count: number; color: string }) {
  if (count === 0) return <Ionicons name="water-outline" size={15} color={color} />;
  return (
    <View style={styles.drops}>
      {Array.from({ length: count }, (_, i) => (
        <Ionicons key={i} name="water" size={15} color={color} />
      ))}
    </View>
  );
}

type FlowSelectorProps = { value: Flow | undefined; onChange: (flow: Flow | null) => void };

/** Four soft tiles; single choice, and tapping the selected level again clears it. */
export function FlowSelector({ value, onChange }: FlowSelectorProps) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Flow" style={styles.row}>
      {FLOWS.map((f) => {
        const selected = value === f.id;
        const ink = selected ? colors.onPeriod : colors.ink;
        return (
          <Pressable
            key={f.id}
            accessibilityRole="radio"
            accessibilityLabel={f.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(selected ? null : f.id)}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: selected ? colors.period : colors.canvas },
              pressed && styles.pressed,
            ]}>
            <Drops count={f.drops} color={selected ? colors.onPeriod : colors.periodLine} />
            <Text style={[styles.label, { color: ink }]}>{f.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  tile: {
    flex: 1,
    minHeight: 76,
    borderRadius: radius.inset,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
  },
  pressed: { transform: [{ scale: 0.96 }] },
  drops: { flexDirection: 'row', gap: 1 },
  // 13px so "Spotting" fits a quarter of a card on a 375pt phone.
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
});
