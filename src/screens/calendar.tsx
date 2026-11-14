import { StyleSheet, View } from 'react-native';

import { MonthGrid, type DayInfo, type DayMark } from '@/components/month-grid';
import { Card, IconButton, Text, TextButton } from '@/components/ui';
import { Drift, FlowPage } from '@/flow/flow-page';
import { useFlow } from '@/flow/flow-provider';
import { RibbonHop } from '@/flow/ribbon-hop';
import { openDay } from '@/flow/sheet';
import { Sticker } from '@/flow/sticker';
import { useMonthCursor } from '@/hooks/use-month-cursor';
import { useDayStatus, usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { formatMonthYear, formatRange, type ISODate } from '@/lib/dates';
import type { DayStatus } from '@/lib/day-status';
import { hasDetails } from '@/lib/record';
import { useAppStore } from '@/store/app-store';
import { radius, space, useTheme } from '@/theme';


/** Logged period days are solid. Anything still to come is an estimate, drawn dashed like a prediction. */
function markOf(status: DayStatus): DayMark {
  switch (status.kind) {
    case 'period':
      return 'period';
    case 'expected-period':
    case 'predicted-period':
      return 'predicted';
    case 'ovulation':
      return 'ovulation';
    default:
      return 'none';
  }
}

function Legend({ ovulation }: { ovulation: boolean }) {
  const { colors } = useTheme();
  const items = [
    { label: 'Period', swatch: { backgroundColor: colors.period } },
    { label: 'Predicted', swatch: { borderColor: colors.periodLine, borderWidth: 1.5, borderStyle: 'dashed' as const } },
    ...(ovulation
      ? [
          {
            label: 'Ovulation estimate',
            swatch: { borderColor: colors.ovulationLine, borderWidth: 1.5, borderStyle: 'dotted' as const },
          },
        ]
      : []),
    { label: 'Today', swatch: { backgroundColor: colors.structure, borderColor: colors.ink, borderWidth: 1.5 } },
  ];
  return (
    <View style={styles.legend} accessibilityRole="summary">
      {items.map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <View style={[styles.swatch, item.swatch]} />
          <Text variant="caption" tone="secondary">
            {item.label}
          </Text>
        </View>
      ))}
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
        <Text variant="caption" tone="secondary">
          Has a log
        </Text>
      </View>
    </View>
  );
}

export function CalendarPage() {
  const { width } = useFlow();
  const today = useToday();
  const prediction = usePrediction(today);
  const statusOf = useDayStatus(prediction, today);
  const logs = useAppStore((s) => s.record.logs);
  const weekStartsOn = useAppStore((s) => s.settings.weekStartsOn);
  const month = useMonthCursor(today);
  const hasOvulation = prediction.ovulation.length > 0;

  const getDayInfo = (date: ISODate): DayInfo => ({
    mark: markOf(statusOf(date)),
    isToday: date === today,
    hasLog: hasDetails(logs[date]),
    isFuture: date > today,
  });

  const [monthName, year] = formatMonthYear(month.year, month.monthIndex).split(' ');

  return (
    <FlowPage>
      <View style={styles.stage}>
        <Sticker name="leap" width={width * 0.42} drift={-0.18} style={styles.leaper} />
        <Sticker name="ball" width={width * 0.15} drift={-0.34} rotate={-14} style={styles.ball} />
      </View>

      <Drift amount={0.06}>
        <Card style={styles.card}>
          <View>
            <Text
              variant="headingLg"
              accessibilityRole="header"
              accessibilityLiveRegion="polite"
              numberOfLines={1}
              adjustsFontSizeToFit>
              {monthName}
            </Text>
            <View style={styles.monthRow}>
              <Text variant="subheading" tone="secondary" style={styles.year}>
                {year}
              </Text>
              {!month.isCurrent ? <TextButton label="Today" onPress={month.reset} /> : null}
              <IconButton tone="inset" icon="chevron-back" label="Previous month" onPress={() => month.shift(-1)} />
              <IconButton tone="inset" icon="chevron-forward" label="Next month" onPress={() => month.shift(1)} />
            </View>
          </View>
          <MonthGrid
            year={month.year}
            monthIndex={month.monthIndex}
            weekStartsOn={weekStartsOn}
            getDayInfo={getDayInfo}
            onPressDay={openDay}
          />
          <Legend ovulation={hasOvulation} />
        </Card>
      </Drift>

      {prediction.next && prediction.status !== 'late' ? (
        <Drift amount={0.1} style={styles.hop}>
          <RibbonHop tone="sky">
            <Card>
              <Text variant="label" tone="secondary">
                Next period
              </Text>
              <Text variant="headingSm">Likely {formatRange(prediction.next.from, prediction.next.to)}</Text>
              <Text variant="body" tone="secondary">
                Dashed days are estimates. They get more precise as you log more cycles.
              </Text>
              {hasOvulation ? (
                <Text variant="body" tone="secondary">
                  Dotted days are a rough ovulation estimate from your dates. Not a method of contraception.
                </Text>
              ) : null}
            </Card>
          </RibbonHop>
        </Drift>
      ) : null}
    </FlowPage>
  );
}

const styles = StyleSheet.create({
  stage: { height: 132 },
  leaper: { right: -2, top: -6 },
  ball: { left: 34, top: 58 },
  card: { paddingTop: space[6], paddingHorizontal: space[5], gap: space[5] },
  hop: { marginTop: space[12] },
  monthRow: { flexDirection: 'row', alignItems: 'center', gap: space[2], marginTop: space[1] },
  year: { flex: 1 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: space[4], rowGap: space[1] },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: radius.full },
  dot: { width: 5, height: 5, borderRadius: radius.full },
});
