import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { Text } from '@/components/ui';
import { radius, space, useTheme } from '@/theme';

export type ChartBar = { key: string; value: number; label: string; excluded: boolean };

type CycleBarChartProps = {
  bars: ChartBar[];
  median: number | null;
  /** Text alternative for screen readers. */
  summary: string;
};

const CHART_HEIGHT = 150;

/** Drawn, not a border: a one-sided dashed border comes out solid on iOS. */
function DashedRule({ color, width = '100%' }: { color: string; width?: number | '100%' }) {
  return (
    <Svg width={width} height={2}>
      <Line x1={0} y1={1} x2="100%" y2={1} stroke={color} strokeWidth={1.5} strokeDasharray="5 5" />
    </Svg>
  );
}

/** Cycle lengths as soft bars from a zero baseline; left-out cycles are dashed and hollow. */
export function CycleBarChart({ bars, median, summary }: CycleBarChartProps) {
  const { colors } = useTheme();
  const max = Math.max(...bars.map((b) => b.value), median ?? 0) * 1.15;
  const height = (v: number) => Math.max(12, (v / max) * CHART_HEIGHT);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={summary}>
      <View style={styles.chart}>
        {bars.map((b) => (
          <View key={b.key} style={styles.column}>
            <View
              style={[
                styles.bar,
                { height: height(b.value) },
                b.excluded
                  ? { borderColor: colors.textSecondary, borderWidth: 1, borderStyle: 'dashed' }
                  : { backgroundColor: colors.structure },
              ]}>
              <Text
                variant="caption"
                align="center"
                style={{ color: b.excluded ? colors.textSecondary : colors.onStructure }}>
                {b.value}
              </Text>
            </View>
          </View>
        ))}
        {median ? (
          <View pointerEvents="none" style={[styles.median, { bottom: height(median) }]}>
            <DashedRule color={colors.ink} />
          </View>
        ) : null}
      </View>
      <View style={styles.labels}>
        {bars.map((b) => (
          <Text key={b.key} variant="caption" tone="secondary" align="center" numberOfLines={1} style={styles.label}>
            {b.label}
          </Text>
        ))}
      </View>
      <View style={styles.key}>
        {median ? (
          <View style={styles.keyItem}>
            <DashedRule color={colors.ink} width={20} />
            <Text variant="caption" tone="secondary">
              Median {median} days
            </Text>
          </View>
        ) : null}
        <View style={styles.keyItem}>
          <View style={[styles.keySwatch, { borderColor: colors.textSecondary }]} />
          <Text variant="caption" tone="secondary">
            Left out
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { height: CHART_HEIGHT, flexDirection: 'row', alignItems: 'flex-end', gap: space[1] },
  column: { flex: 1, alignItems: 'center' },
  bar: { width: '100%', maxWidth: 34, borderRadius: radius.small, paddingTop: space[2] },
  median: { position: 'absolute', left: 0, right: 0 },
  labels: { flexDirection: 'row', gap: space[1], marginTop: space[2] },
  label: { flex: 1 },
  key: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4], marginTop: space[3] },
  keyItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  keySwatch: { width: 12, height: 16, borderRadius: 4, borderWidth: 1, borderStyle: 'dashed' },
});
