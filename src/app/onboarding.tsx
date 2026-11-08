import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LengthSetting } from '@/components/length-setting';
import { MonthGrid } from '@/components/month-grid';
import { Button, Card, IconButton, ProgressBar, SpeechBubble, Text } from '@/components/ui';
import { Drift, FlowPage } from '@/flow/flow-page';
import { useFlow } from '@/flow/flow-provider';
import { FlowStage } from '@/flow/flow-stage';
import { Sticker } from '@/flow/sticker';
import { askForReminders, useReminderPermission } from '@/hooks/use-reminders';
import { useToday } from '@/hooks/use-today';
import { predict, RULES } from '@/lib/cycle';
import { addMonths, formatMonthYear, formatRange, parts, type ISODate } from '@/lib/dates';
import { markPeriodDay } from '@/lib/periods';
import { useAppStore } from '@/store/app-store';
import { gutter, maxContentWidth, space } from '@/theme';

const STEPS = 4;

/** ≤ 4 steps, every question skippable, first prediction in under a minute (§12.2 F-01). Steps pan like the app does. */
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { width, page: step, goTo, jumpTo } = useFlow();
  const today = useToday();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const weekStartsOn = useAppStore((s) => s.settings.weekStartsOn);
  const [lastStart, setLastStart] = useState<ISODate | null>(null);
  const [cycleLength, setCycleLength] = useState<number | null>(RULES.defaultCycle);
  const [periodLength, setPeriodLength] = useState<number | null>(RULES.defaultPeriod);
  const [cursor, setCursor] = useState(() => parts(today));
  const permission = useReminderPermission();

  useEffect(() => {
    jumpTo(0);
  }, [jumpTo]);

  const next = () => goTo(Math.min(STEPS - 1, step + 1));
  const back = () => goTo(Math.max(0, step - 1));
  // Flipping `onboarded` hands over to the main app (see the protected routes in _layout).
  const finish = () => {
    completeOnboarding({ lastPeriodStart: lastStart, cycleLength, periodLength });
    askForReminders();
  };

  const preview = predict(
    {
      periods: lastStart ? markPeriodDay([], lastStart, periodLength ?? RULES.defaultPeriod) : [],
      overrides: {},
      typicalCycleLength: cycleLength,
      typicalPeriodLength: periodLength,
    },
    today,
  );

  const actions =
    step === 0 ? (
      <Button label="Get started" onPress={next} />
    ) : step === 1 ? (
      <>
        <Button label="Continue" onPress={next} disabled={!lastStart} />
        <Button
          variant="secondary"
          onCanvas
          icon="help"
          label="I don't remember"
          onPress={() => {
            setLastStart(null);
            next();
          }}
        />
      </>
    ) : step === 2 ? (
      <Button label="Continue" onPress={next} />
    ) : (
      <Button label="Start tracking" onPress={finish} />
    );

  const chrome = (
    <>
      <View pointerEvents="box-none" style={[styles.top, { top: insets.top + space[2] }]}>
        <View style={styles.column}>
          <View style={styles.progress}>
            {step > 0 ? <IconButton icon="chevron-back" label="Back" onPress={back} /> : null}
            <ProgressBar value={(step + 1) / STEPS} label={`Step ${step + 1} of ${STEPS}`} />
          </View>
        </View>
      </View>
      <View pointerEvents="box-none" style={[styles.actions, { bottom: insets.bottom + space[3] }]}>
        <View style={styles.column}>{actions}</View>
      </View>
    </>
  );

  const pages = [
    <FlowPage key="welcome" index={0}>
      <View style={styles.spacer} />
      <Drift page={0} amount={0.06}>
        <Card>
          <Text variant="headingLg" accessibilityRole="header">
            A calm period tracker
          </Text>
          <Text variant="paragraph" tone="secondary">
            A simple way to keep track of your period. Predictions are shown as honest ranges, and they get more
            personal as you log.
          </Text>
        </Card>
      </Drift>
      <View style={styles.mascot}>
        <View style={{ maxWidth: width * 0.56 }}>
          <SpeechBubble>No account, no ads. Nothing you log leaves this phone.</SpeechBubble>
        </View>
        <Sticker name="climb" page={0} width={width * 0.3} style={styles.climber} />
      </View>
    </FlowPage>,

    <FlowPage key="last-period" index={1}>
      <View style={styles.spacer} />
      <Drift page={1} amount={0.06}>
        <Card style={styles.calendar}>
          <Text variant="headingSm" accessibilityRole="header">
            When did your last period start?
          </Text>
          <Text variant="body" tone="secondary">
            Tap the first day. A rough guess is fine — you can change it later.
          </Text>
          <View style={styles.monthNav}>
            <IconButton
              tone="inset"
              icon="chevron-back"
              label="Previous month"
              onPress={() => setCursor((c) => ({ ...c, ...addMonths(c.year, c.monthIndex, -1) }))}
            />
            <Text variant="subheading" align="center" style={styles.monthName} accessibilityLiveRegion="polite">
              {formatMonthYear(cursor.year, cursor.monthIndex)}
            </Text>
            <IconButton
              tone="inset"
              icon="chevron-forward"
              label="Next month"
              disabled={cursor.year === parts(today).year && cursor.monthIndex === parts(today).monthIndex}
              onPress={() => setCursor((c) => ({ ...c, ...addMonths(c.year, c.monthIndex, 1) }))}
            />
          </View>
          <MonthGrid
            year={cursor.year}
            monthIndex={cursor.monthIndex}
            weekStartsOn={weekStartsOn}
            getDayInfo={(date) => ({
              mark: date === lastStart ? 'period' : 'none',
              isToday: date === today,
              hasLog: false,
              isFuture: date > today,
              disabled: date > today,
            })}
            onPressDay={setLastStart}
          />
        </Card>
      </Drift>
    </FlowPage>,

    <FlowPage key="lengths" index={2}>
      <View style={styles.spacer} />
      <Drift page={2} amount={0.06}>
        <Card>
          <Text variant="heading" accessibilityRole="header">
            What&apos;s usual for you?
          </Text>
          <Text variant="body" tone="secondary">
            A cycle runs from the first day of one period to the day before the next. Not sure? That&apos;s fine — the
            app learns from what you log.
          </Text>
          <LengthSetting
            label="Cycle length"
            value={cycleLength}
            fallback={RULES.defaultCycle}
            min={RULES.minValidCycle}
            max={RULES.maxValidCycle}
            onChange={setCycleLength}
          />
          <LengthSetting
            label="Period length"
            value={periodLength}
            fallback={RULES.defaultPeriod}
            min={1}
            max={14}
            onChange={setPeriodLength}
          />
        </Card>
      </Drift>
    </FlowPage>,

    <FlowPage key="done" index={3}>
      <View style={styles.spacer} />
      <Drift page={3} amount={0.06}>
        <Card>
          <Text variant="headingLg" accessibilityRole="header">
            All set
          </Text>
          {preview.next ? (
            <>
              <Text variant="label" tone="secondary">
                Your next period
              </Text>
              <Text variant="headingSm">Likely {formatRange(preview.next.from, preview.next.to)}</Text>
              <Text variant="body" tone="secondary">
                An early estimate — it gets more personal as you log.
              </Text>
            </>
          ) : (
            <Text variant="paragraph" tone="secondary">
              Tap “Period started” when your next period begins and predictions will take it from there.
            </Text>
          )}
          {permission !== 'unsupported' ? (
            <Text variant="body" tone="secondary">
              We&apos;ll send a quiet reminder the day before your next period and ovulation window. Your phone will
              ask if that&apos;s okay.
            </Text>
          ) : null}
          <Text variant="caption" tone="secondary">
            Predictions are estimates based on the cycles you log. Not a method of contraception.
          </Text>
        </Card>
      </Drift>
      <View style={styles.mascot}>
        <View style={{ maxWidth: width * 0.5 }}>
          <SpeechBubble>That&apos;s it. Log your next period with one tap.</SpeechBubble>
        </View>
        <Sticker name="shrug" page={3} width={width * 0.42} style={styles.shrug} />
      </View>
    </FlowPage>,
  ];

  return <FlowStage pages={pages} chrome={chrome} swipeable={false} />;
}

const styles = StyleSheet.create({
  top: { position: 'absolute', left: gutter, right: gutter, alignItems: 'center' },
  actions: { position: 'absolute', left: gutter, right: gutter, alignItems: 'center' },
  column: { width: '100%', maxWidth: maxContentWidth, gap: space[2] },
  progress: { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 48 },
  spacer: { height: 44 },
  mascot: { minHeight: 180 },
  climber: { right: 0, top: 8 },
  shrug: { right: -6, top: 30 },
  calendar: { paddingHorizontal: space[5], paddingVertical: space[5], gap: space[3] },
  monthNav: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  monthName: { flex: 1 },
});
