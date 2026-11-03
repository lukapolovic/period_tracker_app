import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui';
import { FLOWS } from '@/constants/log-options';
import type { Flow } from '@/lib/cycle';
import { useTheme } from '@/theme';

function Drops({ count }: { count: number }) {
  const { colors } = useTheme();
  if (count === 0) return <Ionicons name="water-outline" size={14} color={colors.period} />;
  return (
    <View style={styles.drops}>
      {Array.from({ length: count }, (_, i) => (
        <Ionicons key={i} name="water" size={14} color={colors.period} />
      ))}
    </View>
  );
}

type FlowChipsProps = { value: Flow | undefined; onChange: (flow: Flow | null) => void };

/** Single choice; tapping the selected level again clears it. */
export function FlowChips({ value, onChange }: FlowChipsProps) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Flow" style={styles.wrap}>
      {FLOWS.map((f) => (
        <Chip
          key={f.id}
          role="radio"
          tone="period"
          label={f.label}
          selected={value === f.id}
          leading={<Drops count={f.drops} />}
          onPress={() => onChange(value === f.id ? null : f.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  drops: { flexDirection: 'row', marginRight: -2 },
});
