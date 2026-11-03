import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MonthGrid, type DayInfo } from '@/components/month-grid';
import { Card, IconButton, Screen, ScreenHeader, Text, TextButton } from '@/components/ui';
import { usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { addMonths, eachDay, formatMonthYear, formatRange, parts, type ISODate } from '@/lib/dates';
import { hasDetails } from '@/lib/log';
import { findPeriod } from '@/lib/periods';
import { useAppStore } from '@/store/app-store';
import { border, space, useTheme } from '@/theme';

function Legend() {
  const { colors } = useTheme();
  const items = [
    { label: 'Period', swatch: { backgroundColor: colors.period, borderColor: colors.period } },
    {
      label: 'Predicted',
      swatch: { backgroundColor: colors.periodWash, borderColor: colors.period, borderStyle: 'dashed' as const },
    },
    { label: 'Today', swatch: { backgroundColor: 'transparent', borderColor: colors.textStrong } },
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

export default function CalendarScreen() {
  const today = useToday();
  const prediction = usePrediction(today);
  const periods = useAppStore((s) => s.periods);
  const logs = useAppStore((s) => s.logs);
  const weekStartsOn = useAppStore((s) => s.settings.weekStartsOn);
  const [cursor, setCursor] = useState(() => parts(today));

  const predicted = useMemo(() => {
    const days = new Set<ISODate>();
    for (const w of prediction.upcoming) for (const d of eachDay(w.from, w.to)) days.add(d);
    return days;
  }, [prediction.upcoming]);

  const getDayInfo = (date: ISODate): DayInfo => {
    const isFuture = date > today;
    const inPeriod = !!findPeriod(periods, date);
    return {
      // Period days still to come are estimates, so they're drawn like predictions.
      mark: inPeriod ? (isFuture ? 'predicted' : 'period') : predicted.has(date) ? 'predicted' : 'none',
      isToday: date === today,
      hasLog: hasDetails(logs[date]),
      isFuture,
    };
  };

  const shift = (delta: number) => setCursor((c) => ({ ...c, ...addMonths(c.year, c.monthIndex, delta) }));
  const now = parts(today);
  const onCurrentMonth = cursor.year === now.year && cursor.monthIndex === now.monthIndex;

  return (
    <Screen>
      <ScreenHeader
        title="Calendar"
        right={<IconButton icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />}
      />

      <Card>
        <View style={styles.monthNav}>
          <IconButton icon="chevron-back" label="Previous month" onPress={() => shift(-1)} />
          <Text
            variant="subheading"
            tone="strong"
            align="center"
            style={styles.month}
            accessibilityRole="header"
            accessibilityLiveRegion="polite">
            {formatMonthYear(cursor.year, cursor.monthIndex)}
          </Text>
          <IconButton icon="chevron-forward" label="Next month" onPress={() => shift(1)} />
        </View>
        <MonthGrid
          year={cursor.year}
          monthIndex={cursor.monthIndex}
          weekStartsOn={weekStartsOn}
          getDayInfo={getDayInfo}
          onPressDay={(date) => router.push({ pathname: '/day/[date]', params: { date } })}
        />
        {!onCurrentMonth ? <TextButton label="Back to today" onPress={() => setCursor(now)} /> : null}
      </Card>

      <Legend />

      {prediction.next && prediction.status !== 'late' ? (
        <Card>
          <Text variant="eyebrow" tone="secondary">
            Next period
          </Text>
          <Text variant="heading" tone="strong">
            Likely {formatRange(prediction.next.from, prediction.next.to)}
          </Text>
          <Text variant="caption" tone="secondary">
            Dashed days are estimates. They get more precise as you log more cycles.
          </Text>
        </Card>
      ) : null}

      <Text variant="caption" tone="secondary" align="center">
        Tap any day to log your period, symptoms, mood or a note.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  monthNav: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: space.xs },
  month: { flex: 1 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: space.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space.xs + 2 },
  swatch: { width: 18, height: 18, borderRadius: 9, borderWidth: border.width },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
