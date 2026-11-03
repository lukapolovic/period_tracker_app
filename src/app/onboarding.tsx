import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LengthSetting } from '@/components/length-setting';
import { MonthGrid } from '@/components/month-grid';
import {
  Button,
  Card,
  IconButton,
  Placeholder,
  ProgressBar,
  Screen,
  Text,
  type IconName,
} from '@/components/ui';
import { useToday } from '@/hooks/use-today';
import { predict, RULES } from '@/lib/cycle';
import { addMonths, formatMonthYear, formatRange, parts, type ISODate } from '@/lib/dates';
import { markPeriodDay } from '@/lib/periods';
import { useAppStore } from '@/store/app-store';
import { space, useTheme } from '@/theme';

const STEPS = 4;

const PROMISES: { icon: IconName; text: string }[] = [
  { icon: 'person-outline', text: 'No account, no sign-up' },
  { icon: 'ban-outline', text: 'No ads, no pop-ups' },
  { icon: 'phone-portrait-outline', text: 'Your data stays on this phone' },
];

function PromiseRow({ icon, text }: { icon: IconName; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.promise}>
      <View style={[styles.promiseIcon, { backgroundColor: colors.primaryWash }]}>
        <Ionicons name={icon} size={20} color={colors.textStrong} />
      </View>
      <Text variant="bodyBold">{text}</Text>
    </View>
  );
}

/** ≤ 4 screens, every question skippable, first prediction in under a minute (§12.2 F-01). */
export default function OnboardingScreen() {
  const today = useToday();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const weekStartsOn = useAppStore((s) => s.settings.weekStartsOn);
  const [step, setStep] = useState(0);
  const [lastStart, setLastStart] = useState<ISODate | null>(null);
  const [cycleLength, setCycleLength] = useState<number | null>(RULES.defaultCycle);
  const [periodLength, setPeriodLength] = useState<number | null>(RULES.defaultPeriod);
  const [cursor, setCursor] = useState(() => parts(today));

  const next = () => setStep((s) => Math.min(STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  // Flipping `onboarded` hands over to the main app (see the protected routes in _layout).
  const finish = () => completeOnboarding({ lastPeriodStart: lastStart, cycleLength, periodLength });

  const preview = predict(
    {
      periods: lastStart ? markPeriodDay([], lastStart, periodLength ?? RULES.defaultPeriod) : [],
      overrides: {},
      typicalCycleLength: cycleLength,
      typicalPeriodLength: periodLength,
    },
    today,
  );

  const footer =
    step === 0 ? (
      <Button label="Get started" onPress={next} />
    ) : step === 1 ? (
      <>
        <Button label="Continue" onPress={next} disabled={!lastStart} />
        <Button
          variant="secondary"
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

  return (
    <Screen edges={['top', 'bottom']} footer={footer}>
      <View style={styles.top}>
        {step > 0 ? <IconButton icon="chevron-back" label="Back" onPress={back} /> : null}
        <ProgressBar value={(step + 1) / STEPS} label={`Step ${step + 1} of ${STEPS}`} />
      </View>

      {step === 0 ? (
        <View style={styles.step}>
          <Placeholder kind="character" brief="Mascot waving hello" height={230} />
          <Text variant="displaySm" tone="strong" align="center">
            Hi there!
          </Text>
          <Text variant="subheading" tone="secondary" align="center">
            A calm, simple way to keep track of your period.
          </Text>
          <View style={styles.promises}>
            {PROMISES.map((p) => (
              <PromiseRow key={p.text} {...p} />
            ))}
          </View>
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.step}>
          <Text variant="title" tone="strong" accessibilityRole="header">
            When did your last period start?
          </Text>
          <Text variant="body" tone="secondary">
            Tap the first day. A rough guess is fine — you can change it later.
          </Text>
          <Card>
            <View style={styles.monthNav}>
              <IconButton
                icon="chevron-back"
                label="Previous month"
                onPress={() => setCursor((c) => ({ ...c, ...addMonths(c.year, c.monthIndex, -1) }))}
              />
              <Text variant="subheading" tone="strong" align="center" style={styles.month} accessibilityLiveRegion="polite">
                {formatMonthYear(cursor.year, cursor.monthIndex)}
              </Text>
              <IconButton
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
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.step}>
          <Text variant="title" tone="strong" accessibilityRole="header">
            What&apos;s usual for you?
          </Text>
          <Text variant="body" tone="secondary">
            A cycle runs from the first day of one period to the day before the next. Not sure? That&apos;s fine — the
            app learns from what you log.
          </Text>
          <Card>
            <LengthSetting
              label="Cycle length"
              value={cycleLength}
              fallback={RULES.defaultCycle}
              min={RULES.minValidCycle}
              max={RULES.maxValidCycle}
              onChange={setCycleLength}
            />
          </Card>
          <Card>
            <LengthSetting
              label="Period length"
              value={periodLength}
              fallback={RULES.defaultPeriod}
              min={1}
              max={14}
              onChange={setPeriodLength}
            />
          </Card>
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.step}>
          <Placeholder kind="animation" brief="Celebration burst as setup finishes" height={200} />
          <Text variant="displaySm" tone="strong" align="center">
            All set!
          </Text>
          {preview.next ? (
            <Card>
              <Text variant="eyebrow" tone="secondary">
                Your next period
              </Text>
              <Text variant="heading" tone="strong">
                Likely {formatRange(preview.next.from, preview.next.to)}
              </Text>
              <Text variant="caption" tone="secondary">
                An early estimate — it gets more personal as you log.
              </Text>
            </Card>
          ) : (
            <Text variant="body" tone="secondary" align="center">
              Tap “Period started” when your next period begins and predictions will take it from there.
            </Text>
          )}
          <Text variant="caption" tone="secondary" align="center">
            Predictions are estimates based on the cycles you log. Not a method of contraception.
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 48 },
  step: { gap: space.lg },
  promises: { gap: space.md, paddingTop: space.sm },
  promise: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  promiseIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  monthNav: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: space.xs },
  month: { flex: 1 },
});
