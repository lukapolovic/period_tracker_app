import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { FlowChips } from '@/components/flow-chips';
import { Button, Card, Chip, IconButton, Notice, Screen, ScreenHeader, Text, TextButton } from '@/components/ui';
import { MOODS, SYMPTOMS } from '@/constants/log-options';
import { usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { sortPeriods } from '@/lib/cycle';
import { diffDays, formatDay, formatRange, isISODate, type ISODate } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';
import { goBack } from '@/lib/navigation';
import { edgeOf, findPeriod } from '@/lib/periods';
import { useAppStore } from '@/store/app-store';
import { border, fonts, radius, space, useTheme } from '@/theme';

export default function DayScreen() {
  const params = useLocalSearchParams<{ date: string }>();
  const today = useToday();
  const date: ISODate = isISODate(params.date) ? params.date : today;
  const isFuture = date > today;

  const { colors } = useTheme();
  const prediction = usePrediction(today);
  const periods = useAppStore((s) => s.periods);
  const log = useAppStore((s) => s.logs[date]);
  const markPeriodDay = useAppStore((s) => s.markPeriodDay);
  const unmarkPeriodDay = useAppStore((s) => s.unmarkPeriodDay);
  const endPeriodOn = useAppStore((s) => s.endPeriodOn);
  const setFlow = useAppStore((s) => s.setFlow);
  const toggleSymptom = useAppStore((s) => s.toggleSymptom);
  const toggleMood = useAppStore((s) => s.toggleMood);
  const setNote = useAppStore((s) => s.setNote);
  const [note, setNoteText] = useState(log?.note ?? '');

  const period = findPeriod(periods, date);
  const edge = period ? edgeOf(period, date) : null;
  const window = prediction.upcoming.find((w) => w.from <= date && date <= w.to);
  const cycleStart = sortPeriods(periods)
    .filter((p) => p.start <= date)
    .at(-1)?.start;

  const status = period
    ? `Period day ${diffDays(date, period.start) + 1}${period.endEstimated && date >= period.end ? ' · end estimated' : ''}`
    : window
      ? `Period likely to start ${formatRange(window.from, window.to)}`
      : cycleStart && !isFuture
        ? `Cycle day ${diffDays(date, cycleStart) + 1}`
        : null;

  const saveNote = () => {
    if ((log?.note ?? '') !== note) setNote(date, note);
  };
  const done = () => {
    saveNote();
    goBack();
  };
  const togglePeriodDay = () => {
    if (period) unmarkPeriodDay(date);
    else markPeriodDay(date);
    tapFeedback();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen
        edges={['top', 'bottom']}
        footer={<Button label="Done" onPress={done} />}>
        <ScreenHeader
          eyebrow={date === today ? 'Today' : isFuture ? 'Upcoming' : 'Log a day'}
          title={formatDay(date, { weekday: true, month: 'long', year: date.slice(0, 4) !== today.slice(0, 4) })}
          right={<IconButton icon="close" label="Close" onPress={done} />}
        />
        {status ? (
          <Text variant="bodyBold" tone="secondary">
            {status}
          </Text>
        ) : null}

        {isFuture ? (
          <Notice icon="time-outline">You can log this day once it&apos;s here.</Notice>
        ) : (
          <>
            <Card title="Period">
              <View style={styles.row}>
                <Chip
                  tone="period"
                  label="Period day"
                  selected={!!period}
                  disabled={edge === 'middle'}
                  onPress={togglePeriodDay}
                  accessibilityHint={period ? 'Removes this day from the period' : 'Marks this day as a period day'}
                />
              </View>
              {edge === 'middle' ? (
                <Text variant="caption" tone="secondary">
                  This day is in the middle of a period. To shorten it, remove days from its start or use “Period
                  ended on this day” on an earlier day.
                </Text>
              ) : null}
              <Text variant="eyebrow" tone="secondary">
                Flow
              </Text>
              <FlowChips value={log?.flow} onChange={(flow) => setFlow(date, flow)} />
              {period && (period.endEstimated || period.end !== date) ? (
                <View style={styles.row}>
                  <TextButton label="Period ended on this day" icon="checkmark" onPress={() => endPeriodOn(date)} />
                </View>
              ) : null}
            </Card>

            <Card title="Symptoms">
              <View style={styles.chips}>
                {SYMPTOMS.map((s) => (
                  <Chip
                    key={s.id}
                    label={s.label}
                    selected={!!log?.symptoms?.includes(s.id)}
                    onPress={() => toggleSymptom(date, s.id)}
                  />
                ))}
              </View>
            </Card>

            <Card title="Mood">
              <View style={styles.chips}>
                {MOODS.map((m) => (
                  <Chip
                    key={m.id}
                    label={m.label}
                    selected={!!log?.moods?.includes(m.id)}
                    onPress={() => toggleMood(date, m.id)}
                  />
                ))}
              </View>
            </Card>

            <Card title="Note">
              <TextInput
                value={note}
                onChangeText={setNoteText}
                onBlur={saveNote}
                placeholder="Anything you want to remember about this day"
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={500}
                accessibilityLabel="Note"
                style={[
                  styles.note,
                  { color: colors.text, borderColor: colors.line, backgroundColor: colors.surfaceAlt },
                ]}
              />
            </Card>
          </>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  note: {
    minHeight: 110,
    borderWidth: border.width,
    borderRadius: radius.control,
    padding: space.md,
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 23,
    textAlignVertical: 'top',
  },
});
