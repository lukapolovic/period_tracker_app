import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CycleRing } from '@/components/cycle-ring';
import { FlowChips } from '@/components/flow-chips';
import { Snackbar, useSnackbar } from '@/components/snackbar';
import {
  Button,
  Card,
  Chip,
  IconButton,
  Notice,
  Placeholder,
  Screen,
  ScreenHeader,
  SectionTitle,
  Text,
  TextButton,
} from '@/components/ui';
import { MOODS, QUICK_MOODS, QUICK_SYMPTOMS, SYMPTOMS } from '@/constants/log-options';
import { usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { RULES, type Prediction } from '@/lib/cycle';
import { diffDays, formatDay, formatRange, plural, type ISODate } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';
import { findPeriod } from '@/lib/periods';
import { useAppStore } from '@/store/app-store';
import { space } from '@/theme';

const labelOf = (id: string) => [...SYMPTOMS, ...MOODS].find((o) => o.id === id)?.label ?? id;

function heroFor(p: Prediction, endedToday: boolean) {
  const nextRange = p.next ? formatRange(p.next.from, p.next.to) : '';
  switch (p.status) {
    case 'empty':
      return {
        big: 'Hi!',
        caption: "Let's track your first period",
        sub: 'Tap the button when your period starts — or add your last one in the calendar.',
      };
    case 'period':
      return {
        big: `Day ${p.periodDay}`,
        caption: endedToday ? 'Last day of your period' : 'of your period',
        sub: `Next period likely ${nextRange}`,
      };
    case 'upcoming':
      return {
        big: `${p.daysUntil!.from}–${p.daysUntil!.to}`,
        caption: 'days until your period',
        sub: `Likely ${nextRange} · Cycle day ${p.cycleDay}`,
      };
    case 'window':
      return {
        big: 'Soon',
        caption: 'Your period could start any day',
        sub: `Likely by ${formatDay(p.next!.to)} · Cycle day ${p.cycleDay}`,
      };
    case 'late':
      return {
        big: `${p.daysLate}`,
        caption: `${p.daysLate === 1 ? 'day' : 'days'} later than expected`,
        sub: 'That happens. Log it when it starts — or add it in the calendar if it already did.',
      };
  }
}

function ringFor(p: Prediction) {
  const periodDays = p.cycles.at(-1)?.periodLength ?? 0;
  const window =
    p.next && p.lastStart
      ? { fromDay: diffDays(p.next.from, p.lastStart) + 1, toDay: diffDays(p.next.to, p.lastStart) + 1 }
      : null;
  const totalDays = Math.max(p.baseLength + p.spread, p.cycleDay ?? 0, periodDays, window?.toDay ?? 0);
  const label =
    p.status === 'empty'
      ? 'Cycle ring. No periods logged yet.'
      : [
          `Cycle day ${p.cycleDay}.`,
          `Period on days 1 to ${periodDays}.`,
          p.next ? `Next period likely ${formatRange(p.next.from, p.next.to)}.` : '',
        ].join(' ');
  return { periodDays, window, totalDays, label };
}

export default function TodayScreen() {
  const today = useToday();
  const prediction = usePrediction(today);
  const log = useAppStore((s) => s.logs[today]);
  const markPeriodDay = useAppStore((s) => s.markPeriodDay);
  const endPeriodOn = useAppStore((s) => s.endPeriodOn);
  const setFlow = useAppStore((s) => s.setFlow);
  const toggleSymptom = useAppStore((s) => s.toggleSymptom);
  const toggleMood = useAppStore((s) => s.toggleMood);
  const snapshot = useAppStore((s) => s.snapshot);
  const restore = useAppStore((s) => s.restore);
  const { snack, show, hide } = useSnackbar();

  const current = prediction.currentPeriod;
  const endedToday = !!current && !current.endEstimated && current.end === today;
  const hero = heroFor(prediction, endedToday);
  const ring = ringFor(prediction);
  const openDay = (date: ISODate) => router.push({ pathname: '/day/[date]', params: { date } });

  /** Every change from Today can be undone from the snackbar. */
  const withUndo = (action: () => void, message: () => string) => {
    const before = snapshot();
    action();
    tapFeedback();
    show({ message: message(), actionLabel: 'Undo', onAction: () => restore(before) });
  };

  const periodStarted = () => {
    const sinceLast = prediction.cycleDay ? prediction.cycleDay - 1 : null;
    withUndo(
      () => markPeriodDay(today),
      () => {
        const period = findPeriod(useAppStore.getState().periods, today);
        if (period && period.start !== today) return 'Added today to your period';
        // Sanity check from §12.2 F-04 — said quietly, never as a pop-up.
        if (sinceLast !== null && sinceLast < RULES.minValidCycle) {
          return `Saved — only ${plural(sinceLast, 'day')} since your last period started.`;
        }
        return 'Period started today';
      },
    );
  };

  const periodEnded = () => withUndo(() => endPeriodOn(today), () => 'Period end saved');

  return (
    <Screen overlay={<Snackbar snack={snack} onHide={hide} />}>
      <ScreenHeader
        eyebrow={formatDay(today, { weekday: true, month: 'long' })}
        title="Today"
        right={<IconButton icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />}
      />

      <View style={styles.hero}>
        <CycleRing
          totalDays={ring.totalDays}
          cycleDay={prediction.cycleDay}
          periodDays={ring.periodDays}
          window={ring.window}
          label={ring.label}>
          <Placeholder
            kind="character"
            brief="Mascot that changes with the cycle phase"
            width={150}
            height={150}
            shape="circle"
          />
        </CycleRing>
        <View style={styles.heroText}>
          <Text variant="display" tone="strong" align="center">
            {hero.big}
          </Text>
          <Text variant="eyebrow" tone="secondary" align="center">
            {hero.caption}
          </Text>
          <Text variant="body" tone="secondary" align="center" style={styles.sub}>
            {hero.sub}
          </Text>
        </View>
      </View>

      {prediction.status === 'period' && !endedToday ? (
        <Button label="Period ended" icon="checkmark" onPress={periodEnded} />
      ) : prediction.status === 'period' ? (
        <Button label="Log today" icon="create-outline" onPress={() => openDay(today)} />
      ) : (
        <Button label="Period started" icon="water" onPress={periodStarted} />
      )}
      {prediction.status === 'empty' || prediction.status === 'late' ? (
        <TextButton
          label={prediction.status === 'empty' ? 'Add a past period' : 'It started on another day'}
          onPress={() => router.push('/calendar')}
        />
      ) : null}

      <Card
        title="Today's log"
        action={<TextButton label="Edit" icon="create-outline" onPress={() => openDay(today)} />}>
        {prediction.status === 'period' ? (
          <>
            <SectionTitle>Flow</SectionTitle>
            <FlowChips value={log?.flow} onChange={(flow) => setFlow(today, flow)} />
          </>
        ) : null}
        <SectionTitle>How are you feeling?</SectionTitle>
        <View style={styles.chips}>
          {QUICK_SYMPTOMS.map((id) => (
            <Chip
              key={id}
              label={labelOf(id)}
              selected={!!log?.symptoms?.includes(id)}
              onPress={() => toggleSymptom(today, id)}
            />
          ))}
          {QUICK_MOODS.map((id) => (
            <Chip key={id} label={labelOf(id)} selected={!!log?.moods?.includes(id)} onPress={() => toggleMood(today, id)} />
          ))}
          <Chip role="button" label="More" onPress={() => openDay(today)} accessibilityHint="Opens the full log for today" />
        </View>
        {log?.note ? (
          <Text variant="body" tone="secondary" numberOfLines={2}>
            “{log.note}”
          </Text>
        ) : null}
      </Card>

      {prediction.status !== 'empty' && prediction.earlyEstimate ? (
        <Notice icon="sparkles-outline">Early estimate. Log two periods and predictions become personal.</Notice>
      ) : null}
      {prediction.cyclesVary ? (
        <Notice>Your cycles vary, so predictions show a wider range.</Notice>
      ) : null}
      {prediction.status === 'late' && (prediction.daysLate ?? 0) > prediction.baseLength ? (
        <Notice icon="calendar-outline">
          Haven&apos;t logged in a while? Add any periods you missed in the calendar so predictions can catch up.
        </Notice>
      ) : null}

      <View style={styles.footer}>
        <Text variant="caption" tone="secondary" align="center">
          Predictions are estimates based on the cycles you&apos;ve logged.
        </Text>
        <TextButton label="How predictions work" onPress={() => router.push('/how-it-works')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: space.lg, paddingTop: space.sm },
  heroText: { alignItems: 'center', gap: space.xs },
  sub: { maxWidth: 340, marginTop: space.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  footer: { alignItems: 'center', gap: space.xs, paddingTop: space.sm },
});
