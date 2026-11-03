import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { border, space, useTheme } from '@/theme';

export type ChartBar = { key: string; value: number; label: string; excluded: boolean };

type CycleBarChartProps = {
  bars: ChartBar[];
  median: number | null;
  /** Text alternative for screen readers. */
  summary: string;
};

const CHART_HEIGHT = 140;

/** Cycle lengths as bars; excluded cycles are dashed and hollow, with a dashed median line. */
export function CycleBarChart({ bars, median, summary }: CycleBarChartProps) {
  const { colors } = useTheme();
  const max = Math.max(...bars.map((b) => b.value), median ?? 0) * 1.15;
  const height = (v: number) => Math.max(10, (v / max) * CHART_HEIGHT);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={summary}>
      <View style={styles.chart}>
        {median ? (
          <View
            pointerEvents="none"
            style={[styles.median, { bottom: height(median), borderColor: colors.textSecondary }]}
          />
        ) : null}
        {bars.map((b) => (
          <View key={b.key} style={styles.column}>
            <Text variant="caption" tone={b.excluded ? 'secondary' : 'strong'}>
              {b.value}
            </Text>
            <View
              style={[
                styles.bar,
                { height: height(b.value) },
                b.excluded
                  ? { backgroundColor: colors.surfaceAlt, borderColor: colors.lineStrong, borderStyle: 'dashed' }
                  : { backgroundColor: colors.primary, borderColor: colors.primaryLip },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {bars.map((b) => (
          <Text key={b.key} variant="eyebrow" tone="secondary" align="center" style={styles.label}>
            {b.label}
          </Text>
        ))}
      </View>
      <View style={styles.key}>
        {median ? (
          <View style={styles.keyItem}>
            <View style={[styles.keyLine, { borderColor: colors.textSecondary }]} />
            <Text variant="caption" tone="secondary">
              Median {median} days
            </Text>
          </View>
        ) : null}
        <View style={styles.keyItem}>
          <View style={[styles.keySwatch, { backgroundColor: colors.surfaceAlt, borderColor: colors.lineStrong }]} />
          <Text variant="caption" tone="secondary">
            Left out
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    height: CHART_HEIGHT + 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.sm,
  },
  column: { flex: 1, alignItems: 'center', gap: space.xs },
  bar: { width: '100%', maxWidth: 30, borderRadius: 8, borderWidth: border.width },
  median: { position: 'absolute', left: 0, right: 0, borderTopWidth: 2, borderStyle: 'dashed' },
  labels: { flexDirection: 'row', gap: space.sm, marginTop: space.xs },
  label: { flex: 1, fontSize: 10 },
  key: { flexDirection: 'row', flexWrap: 'wrap', gap: space.lg, marginTop: space.md },
  keyItem: { flexDirection: 'row', alignItems: 'center', gap: space.xs + 2 },
  keyLine: { width: 18, borderTopWidth: 2, borderStyle: 'dashed' },
  keySwatch: { width: 12, height: 16, borderRadius: 4, borderWidth: border.width, borderStyle: 'dashed' },
});
