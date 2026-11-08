import { StyleSheet, View } from 'react-native';

import { CycleRing } from '@/components/cycle-ring';
import { FlowSelector } from '@/components/flow-selector';
import { HeroWrap } from '@/components/hero-wrap';
import { Snackbar, useSnackbar } from '@/components/snackbar';
import { Badge, Button, Card, Chip, Notice, SectionTitle, Text, TextButton } from '@/components/ui';
import { MOODS, QUICK_MOODS, QUICK_SYMPTOMS, SYMPTOMS } from '@/constants/log-options';
import { Drift, FlowPage } from '@/flow/flow-page';
import { Pages, useFlow } from '@/flow/flow-provider';
import { openDay, openHowItWorks } from '@/flow/sheet';
import { Sticker } from '@/flow/sticker';
import { usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { nextOvulation, RULES, type Prediction } from '@/lib/cycle';
import { diffDays, formatDay, formatRange, plural } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';
import { findPeriod } from '@/lib/periods';
import { useAppStore } from '@/store/app-store';
import { radius, space, useTheme } from '@/theme';

const PAGE = Pages.today;

const labelOf = (id: string) => [...SYMPTOMS, ...MOODS].find((o) => o.id === id)?.label ?? id;

type Hero = {
  /** Inside the ring: a small label, the big readout and an optional unit. */
  top: string;
  big: string;
  /** Only numerals get the display size; words like "Soon" use a heading. */
  numeric: boolean;
  unit?: string;
  /** Runs along the ribbon. */
  line: string;
  badge?: { label: string; dashed?: boolean };
  sub?: string;
};

function heroFor(p: Prediction, endedToday: boolean): Hero {
  const nextRange = p.next ? formatRange(p.next.from, p.next.to) : '';
  const predicted = { label: 'Predicted', dashed: true };
  switch (p.status) {
    case 'empty':
      return {
        top: 'Day',
        big: '–',
        numeric: true,
        unit: 'not started',
        line: "Let's track your first period",
        sub: 'Tap the button when your period starts, or add your last one in the calendar.',
      };
    case 'period':
      return {
        top: 'Period day',
        big: `${p.periodDay}`,
        numeric: true,
        unit: endedToday ? 'last day' : undefined,
        line: nextRange ? `Next period likely ${nextRange}` : 'Your period is here',
        badge: nextRange ? predicted : undefined,
      };
    case 'upcoming': {
      const { from, to } = p.daysUntil!;
      return {
        top: 'Next period in',
        big: from === to ? `${from}` : `${from}–${to}`,
        numeric: true,
        unit: to === 1 ? 'day' : 'days',
        line: `Likely ${nextRange}`,
        badge: predicted,
        sub: `Cycle day ${p.cycleDay}`,
      };
    }
    case 'window':
      return {
        top: 'Next period',
        big: 'Soon',
        numeric: false,
        unit: 'any day now',
        line: `Likely by ${formatDay(p.next!.to)}`,
        badge: predicted,
        sub: `Cycle day ${p.cycleDay}`,
      };
    case 'late':
      return {
        top: 'Late by',
        big: `${p.daysLate}`,
        numeric: true,
        unit: p.daysLate === 1 ? 'day' : 'days',
        line: 'Later than expected',
        badge: { label: 'Late' },
        sub: 'That happens. Log it when it starts, or add it in the calendar if it already did.',
      };
  }
}

function ringFor(p: Prediction) {
  const periodDays = p.cycles.at(-1)?.periodLength ?? 0;
  const window =
    p.next && p.lastStart
      ? { fromDay: diffDays(p.next.from, p.lastStart) + 1, toDay: diffDays(p.next.to, p.lastStart) + 1 }
      : null;
  const thisCycle = p.ovulation.find((w) => p.next && w.to < p.next.likelyStart);
  const ovulation =
    thisCycle && p.lastStart
      ? { fromDay: diffDays(thisCycle.from, p.lastStart) + 1, toDay: diffDays(thisCycle.to, p.lastStart) + 1 }
      : null;
  const totalDays = Math.max(p.baseLength + p.spread, p.cycleDay ?? 0, periodDays, window?.toDay ?? 0);
  const label =
    p.status === 'empty'
      ? 'Cycle ring. No periods logged yet.'
      : [
          `Cycle day ${p.cycleDay}.`,
          `Period on days 1 to ${periodDays}.`,
          thisCycle ? `Estimated ovulation window ${formatRange(thisCycle.from, thisCycle.to)}.` : '',
          p.next ? `Next period likely ${formatRange(p.next.from, p.next.to)}.` : '',
        ].join(' ');
  return { periodDays, window, ovulation, totalDays, label };
}

export function TodayPage() {
  const { colors } = useTheme();
  const { width, goTo } = useFlow();
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
  const ovulation = nextOvulation(prediction, today);

  const discRadius = Math.min(width * 0.31, 150);
  const heroHeight = discRadius * 2.9;
  const shortSub = !!hero.sub && hero.sub.length < 20;

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
    <FlowPage index={PAGE} overlay={<Snackbar snack={snack} onHide={hide} />}>
      <Drift page={PAGE} amount={0.04} style={styles.dateRow}>
        <View style={[styles.pill, { backgroundColor: colors.surface }]}>
          <Text variant="label" accessibilityRole="header">
            {formatDay(today, { weekday: true, month: 'long' })}
          </Text>
        </View>
      </Drift>

      <View style={styles.stage}>
        <HeroWrap page={PAGE} radius={discRadius} height={heroHeight} ribbonText={hero.line}>
          <CycleRing
            size={discRadius * 1.74}
            totalDays={ring.totalDays}
            cycleDay={prediction.cycleDay}
            periodDays={ring.periodDays}
            window={ring.window}
            ovulation={ring.ovulation}
            label={`${ring.label} ${hero.top} ${hero.big} ${hero.unit ?? ''}. ${hero.line}.`}>
            <Text variant="label" tone="secondary" align="center">
              {hero.top}
            </Text>
            <Text
              variant={hero.numeric ? 'display' : 'heading'}
              align="center"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.big}>
              {hero.big}
            </Text>
            {hero.unit ? (
              <Text variant="label" tone="secondary" align="center">
                {hero.unit}
              </Text>
            ) : null}
          </CycleRing>
        </HeroWrap>
        <Sticker name="sit-wave" page={PAGE} width={width * 0.25} style={styles.waver} />
        <Sticker name="spark-coral" page={PAGE} width={30} drift={-0.3} rotate={10} style={styles.sparkA} />
        <Sticker name="spark-green" page={PAGE} width={36} drift={-0.34} rotate={-12} style={styles.sparkB} />
      </View>

      <Drift page={PAGE} amount={0.05} style={styles.tags}>
        {shortSub ? (
          <View style={[styles.tag, { backgroundColor: colors.surface }]}>
            <Text variant="label">{hero.sub}</Text>
          </View>
        ) : null}
        {hero.badge ? <Badge label={hero.badge.label} dashed={hero.badge.dashed} /> : null}
        {ovulation && ovulation.from <= today ? <Badge label="Ovulation estimate" dashed /> : null}
      </Drift>
      {hero.sub && !shortSub ? <Notice>{hero.sub}</Notice> : null}

      <Drift page={PAGE} amount={0.08} style={styles.actions}>
        {prediction.status === 'period' && !endedToday ? (
          <Button label="Period ended" icon="checkmark" onPress={periodEnded} />
        ) : prediction.status === 'period' ? (
          <Button label="Log today" icon="create-outline" onPress={() => openDay(today)} />
        ) : (
          <Button label="Period started" icon="water" onPress={periodStarted} />
        )}
        {prediction.status === 'empty' || prediction.status === 'late' ? (
          <TextButton
            onCanvas
            label={prediction.status === 'empty' ? 'Add a past period' : 'It started on another day'}
            onPress={() => goTo(Pages.calendar)}
          />
        ) : null}
      </Drift>

      <Drift page={PAGE} amount={0.12}>
        <Card
          title="Today's log"
          action={<TextButton label="Edit" onPress={() => openDay(today)} />}>
          {prediction.status === 'period' ? (
            <>
              <SectionTitle>Flow</SectionTitle>
              <FlowSelector value={log?.flow} onChange={(flow) => setFlow(today, flow)} />
            </>
          ) : null}
          <SectionTitle>How are you feeling?</SectionTitle>
          <View style={styles.chips}>
            {QUICK_SYMPTOMS.map((id) => (
              <Chip
                key={id}
                category="symptom"
                label={labelOf(id)}
                selected={!!log?.symptoms?.includes(id)}
                onPress={() => toggleSymptom(today, id)}
              />
            ))}
            {QUICK_MOODS.map((id) => (
              <Chip
                key={id}
                category="mood"
                label={labelOf(id)}
                selected={!!log?.moods?.includes(id)}
                onPress={() => toggleMood(today, id)}
              />
            ))}
            <Chip role="button" label="More" onPress={() => openDay(today)} accessibilityHint="Opens the full log for today" />
          </View>
          {log?.note ? (
            <Text variant="paragraph" tone="secondary" numberOfLines={2}>
              “{log.note}”
            </Text>
          ) : null}
        </Card>
      </Drift>

      {ovulation ? (
        <Drift page={PAGE} amount={0.14}>
          <Card>
            <Text variant="label" tone="secondary">
              Ovulation estimate
            </Text>
            <Text variant="headingSm">Likely {formatRange(ovulation.from, ovulation.to)}</Text>
            <Text variant="body" tone="secondary">
              A rough estimate from your cycle dates. Not a method of contraception.
            </Text>
          </Card>
        </Drift>
      ) : null}

      {prediction.status !== 'empty' && prediction.earlyEstimate ? (
        <Notice icon="sparkles">Early estimate. Log two periods and predictions become personal.</Notice>
      ) : null}
      {prediction.cyclesVary ? <Notice>Your cycles vary, so predictions show a wider range.</Notice> : null}
      {prediction.status === 'late' && (prediction.daysLate ?? 0) > prediction.baseLength ? (
        <Notice icon="calendar-clear">
          Haven&apos;t logged in a while? Add any periods you missed in the calendar so predictions can catch up.
        </Notice>
      ) : null}

      <View style={[styles.band, { height: width * 0.6 }]}>
        <Sticker name="cheer" page={PAGE} width={width * 0.32} drift={-0.2} style={styles.cheer} />
        <Sticker name="skip" page={PAGE} width={width * 0.38} drift={-0.28} style={styles.skip} />
        <Sticker name="spark-lilac" page={PAGE} width={34} drift={-0.36} rotate={12} style={styles.sparkC} />
      </View>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Text variant="caption" tone="secondary" align="center">
          Predictions are estimates based on the cycles you&apos;ve logged.
        </Text>
        <TextButton label="How predictions work" onPress={openHowItWorks} />
      </View>
    </FlowPage>
  );
}

const styles = StyleSheet.create({
  dateRow: { alignItems: 'flex-start' },
  pill: {
    paddingHorizontal: space[5],
    paddingVertical: space[3],
    borderRadius: radius.full,
  },
  stage: { alignItems: 'center', marginTop: -space[6] },
  big: { maxWidth: '100%' },
  waver: { right: 2, top: -14 },
  sparkA: { left: 26, top: 40 },
  sparkB: { left: 60, bottom: 22 },
  band: { marginVertical: -space[3] },
  cheer: { left: 14, top: 0 },
  skip: { right: 6, top: 46 },
  sparkC: { left: '46%', top: 28 },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: space[2],
    marginTop: -space[4],
  },
  tag: { paddingHorizontal: space[4], paddingVertical: space[2], borderRadius: radius.full },
  actions: { gap: space[3] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  footer: {
    alignItems: 'center',
    gap: space[1],
    paddingTop: space[5],
    paddingBottom: space[3],
    paddingHorizontal: space[6],
    borderRadius: radius.card,
  },
});
