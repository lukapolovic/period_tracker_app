import { StyleSheet, View } from 'react-native';

import { Chip, SectionTitle, Stepper } from '@/components/ui';
import { space } from '@/theme';

type LengthSettingProps = {
  label: string;
  value: number | null;
  fallback: number;
  min: number;
  max: number;
  onChange: (value: number | null) => void;
};

/** A typical length in days, or "Not sure" — every answer can be skipped. */
export function LengthSetting({ label, value, fallback, min, max, onChange }: LengthSettingProps) {
  return (
    <View style={styles.setting}>
      <SectionTitle>{label}</SectionTitle>
      <Stepper
        label={label}
        value={value ?? fallback}
        min={min}
        max={max}
        unit="days"
        disabled={value === null}
        onChange={onChange}
      />
      <View style={styles.center}>
        <Chip label="Not sure" selected={value === null} onPress={() => onChange(value === null ? fallback : null)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  setting: { gap: space.sm, paddingTop: space.sm },
  center: { alignItems: 'center' },
});
