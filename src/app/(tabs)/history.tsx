import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CycleBarChart } from '@/components/cycle-bar-chart';
import { Button, Card, Chip, IconButton, Placeholder, Screen, ScreenHeader, Text, TextButton } from '@/components/ui';
import { usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { RULES, type CycleInfo } from '@/lib/cycle';
import { formatDay, formatRange, parts, plural } from '@/lib/dates';
import { useAppStore } from '@/store/app-store';
import { border, radius, space, useTheme } from '@/theme';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value === '—' ? 'not enough data yet' : `${value} ${unit}`}`}
      style={[styles.stat, { borderColor: colors.line, backgroundColor: colors.surface }]}>
      <Text variant="eyebrow" tone="secondary" numberOfLines={1}>
        {label}
      </Text>
      <Text variant="heading" tone="strong">
        {value}
      </Text>
      <Text variant="caption" tone="secondary">
        {unit}
      </Text>
    </View>
  );
}

function flagFor(c: CycleInfo): string | null {
  if (!c.outOfRange || c.length === null) return null;
  return c.length < RULES.minValidCycle
    ? 'Unusually short — did you miss a log?'
    : 'Unusually long — did you miss a log?';
}

function CycleRow({ cycle, onToggle }: { cycle: CycleInfo; onToggle: () => void }) {
  const { colors } = useTheme();
  const flag = flagFor(cycle);
  return (
    <View style={[styles.row, { borderTopColor: colors.line }]}>
      <View style={styles.rowTop}>
        <View style={styles.rowText}>
          <Text variant="bodyBold" tone="strong">
            {formatRange(cycle.start, cycle.end!, { year: true })}
          </Text>
          <Text variant="caption" tone="secondary">
            Period {plural(cycle.periodLength, 'day')}
            {cycle.periodEndEstimated ? ' (end estimated)' : ''}
          </Text>
        </View>
        <View style={[styles.badge, { borderColor: colors.line, backgroundColor: colors.surfaceAlt }]}>
          <Text variant="bodyBold" tone={cycle.included ? 'strong' : 'secondary'}>
            {plural(cycle.length!, 'day')}
          </Text>
        </View>
      </View>
      {flag ? (
        <Text variant="caption" tone="period">
          {flag}
        </Text>
      ) : null}
      <View style={styles.rowActions}>
        <Chip
          label="Count in predictions"
          selected={cycle.included}
          onPress={onToggle}
          accessibilityHint="Include or leave out this cycle, for example after illness or travel"
        />
      </View>
      {cycle.included && !cycle.usedForPrediction ? (
        <Text variant="caption" tone="secondary">
          Older than your last {RULES.maxCyclesUsed} cycles, so it isn&apos;t used right now.
        </Text>
      ) : null}
    </View>
  );
}

export default function HistoryScreen() {
  const today = useToday();
  const prediction = usePrediction(today);
  const setCycleOverride = useAppStore((s) => s.setCycleOverride);

  const completed = prediction.cycles.filter((c) => c.length !== null);
  const current = prediction.cycles.find((c) => c.length === null) ?? null;
  const used = prediction.usedLengths;
  const personal = used.length >= RULES.minCyclesPersonal;
  const bars = completed.slice(-10).map((c) => ({
    key: c.start,
    value: c.length!,
    label: MONTHS_SHORT[parts(c.start).monthIndex],
    excluded: !c.included,
  }));
  const summary = `Cycle lengths, oldest to newest: ${bars.map((b) => `${b.value}${b.excluded ? ' (left out)' : ''}`).join(', ')} days.${
    personal ? ` Median ${prediction.baseLength} days.` : ''
  }`;

  const toggle = (c: CycleInfo) => {
    // Normal cycles count by default; flagged ones only when the user says so.
    if (c.included) setCycleOverride(c.start, c.outOfRange ? null : 'exclude');
    else setCycleOverride(c.start, c.outOfRange ? 'include' : null);
  };

  return (
    <Screen>
      <ScreenHeader
        title="History"
        right={<IconButton icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />}
      />

      <View style={styles.stats}>
        <Stat label="Cycle" value={personal ? String(prediction.baseLength) : '—'} unit="days" />
        <Stat label="Range" value={personal ? `${Math.min(...used)}–${Math.max(...used)}` : '—'} unit="days" />
        <Stat label="Period" value={String(prediction.periodLength)} unit="days" />
      </View>

      {completed.length === 0 ? (
        <Card>
          <Placeholder kind="character" brief="Mascot holding an empty calendar, encouraging" height={180} />
          <Text variant="heading" tone="strong" align="center">
            Your history will show up here
          </Text>
          <Text variant="body" tone="secondary" align="center">
            Log two periods and predictions become personal. You can add past periods in the calendar.
          </Text>
          <Button label="Open calendar" variant="secondary" onPress={() => router.push('/calendar')} />
        </Card>
      ) : (
        <Card title="Cycle length">
          <CycleBarChart bars={bars} median={personal ? prediction.baseLength : null} summary={summary} />
        </Card>
      )}

      {current || completed.length ? (
        <Card title="Cycles">
          {current ? (
            <View style={styles.rowTop}>
              <View style={styles.rowText}>
                <Text variant="bodyBold" tone="strong">
                  Current cycle
                </Text>
                <Text variant="caption" tone="secondary">
                  Started {formatDay(current.start, { year: true })}
                </Text>
              </View>
              {prediction.cycleDay ? (
                <Text variant="bodyBold" tone="secondary">
                  Day {prediction.cycleDay}
                </Text>
              ) : null}
            </View>
          ) : null}
          {[...completed].reverse().map((c) => (
            <CycleRow key={c.start} cycle={c} onToggle={() => toggle(c)} />
          ))}
        </Card>
      ) : null}

      <TextButton label="How predictions work" onPress={() => router.push('/how-it-works')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: space.sm },
  stat: {
    flex: 1,
    borderWidth: border.width,
    borderRadius: radius.card,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    gap: 2,
  },
  row: { borderTopWidth: border.width, paddingTop: space.md, gap: space.sm },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  rowText: { flex: 1, gap: 2 },
  rowActions: { flexDirection: 'row' },
  badge: {
    borderWidth: border.width,
    borderRadius: radius.control,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
});
