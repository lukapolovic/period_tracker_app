import { StyleSheet, View } from 'react-native';

import { space } from '@/theme';

import { IconButton } from './icon-button';
import { Text } from './text';

type StepperProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function Stepper({ label, value, min, max, unit, onChange, disabled }: StepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <View style={styles.row}>
      <IconButton tone="inset" icon="remove" label={`Decrease ${label}`} onPress={dec} disabled={disabled || value <= min} />
      <View
        style={styles.value}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value, text: `${value} ${unit}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'increment' ? inc() : dec())}>
        <Text variant="heading" tone={disabled ? 'secondary' : 'default'} numberOfLines={1}>
          {value}
        </Text>
        <Text variant="label" tone="secondary" numberOfLines={1}>
          {unit}
        </Text>
      </View>
      <IconButton tone="inset" icon="add" label={`Increase ${label}`} onPress={inc} disabled={disabled || value >= max} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[4] },
  value: { minWidth: 112, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: space[2] },
});
