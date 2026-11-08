import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { FlowSelector } from '@/components/flow-selector';
import { Button, Card, Chip, Notice, SectionTitle, Text, TextButton } from '@/components/ui';
import { MOODS, SYMPTOMS } from '@/constants/log-options';
import { Sheet, useSheet } from '@/flow/sheet';
import { usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { sortPeriods } from '@/lib/cycle';
import { diffDays, formatDay, formatRange, isISODate, type ISODate } from '@/lib/dates';
import { tapFeedback } from '@/lib/haptics';
import { edgeOf, findPeriod } from '@/lib/periods';
import { useAppStore } from '@/store/app-store';
import { fonts, radius, space, useTheme } from '@/theme';

export default function DayScreen() {
  const params = useLocalSearchParams<{ date: string }>();
  const today = useToday();
  const date: ISODate = isISODate(params.date) ? params.date : today;
  const isFuture = date > today;

  const { colors } = useTheme();
  const sheet = useSheet();
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
  const [noteFocused, setNoteFocused] = useState(false);

  const period = findPeriod(periods, date);
  const edge = period ? edgeOf(period, date) : null;
  const window = prediction.upcoming.find((w) => w.from <= date && date <= w.to);
  const cycleStart = sortPeriods(periods)
    .filter((p) => p.start <= date)
    .at(-1)?.start;

  const status = period
    ? `Period day ${diffDays(date, period.start) + 1}${period.endEstimated && date >= period.end ? ', end estimated' : ''}`
    : window
      ? `Period likely to start ${formatRange(window.from, window.to)}`
      : cycleStart && !isFuture
        ? `Cycle day ${diffDays(date, cycleStart) + 1}`
        : null;

  /** Saved as it's typed, so every way out of the sheet keeps it. */
  const changeNote = (text: string) => {
    setNoteText(text);
    setNote(date, text);
  };
  const togglePeriodDay = () => {
    if (period) unmarkPeriodDay(date);
    else markPeriodDay(date);
    tapFeedback();
  };

  return (
    <Sheet
      sheet={sheet}
      eyebrow={date === today ? 'Today' : isFuture ? 'Upcoming' : (status ?? 'Log a day')}
      title={formatDay(date, { weekday: true, month: 'long', year: date.slice(0, 4) !== today.slice(0, 4) })}
      footer={<Button label="Done" icon="checkmark" onPress={sheet.close} />}>
      {date === today && status ? (
        <Text variant="bodyStrong" tone="secondary" style={styles.status}>
          {status}
        </Text>
      ) : null}

      {isFuture ? (
        <Notice icon="time">You can log this day once it&apos;s here.</Notice>
      ) : (
        <>
          <Card title="Period">
            <View style={styles.row}>
              <Chip
                category="period"
                label="Period day"
                selected={!!period}
                disabled={edge === 'middle'}
                onPress={togglePeriodDay}
                accessibilityHint={period ? 'Removes this day from the period' : 'Marks this day as a period day'}
              />
            </View>
            {edge === 'middle' ? (
              <Text variant="caption" tone="secondary">
                This day is in the middle of a period. To shorten it, remove days from its start or use “Period ended
                on this day” on an earlier day.
              </Text>
            ) : null}
            <SectionTitle>Flow</SectionTitle>
            <FlowSelector value={log?.flow} onChange={(flow) => setFlow(date, flow)} />
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
                  category="symptom"
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
                  category="mood"
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
              onChangeText={changeNote}
              onFocus={() => setNoteFocused(true)}
              onBlur={() => setNoteFocused(false)}
              placeholder="Anything you want to remember about this day"
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
              accessibilityLabel="Note"
              style={[
                styles.note,
                { color: colors.ink, backgroundColor: colors.canvas, borderColor: noteFocused ? colors.ink : 'transparent' },
              ]}
            />
          </Card>
        </>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  status: { paddingHorizontal: space[2] },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  note: {
    minHeight: 120,
    // A long note scrolls inside the field, so the line being typed stays in view above the keyboard.
    maxHeight: 168,
    borderWidth: 1,
    borderRadius: radius.inset,
    padding: space[4],
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
});
