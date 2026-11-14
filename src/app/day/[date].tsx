import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { FlowSelector } from '@/components/flow-selector';
import { Button, Card, Chip, Notice, SectionTitle, Text, TextButton } from '@/components/ui';
import { MOODS, SYMPTOMS } from '@/constants/log-options';
import { Sheet, useSheet } from '@/flow/sheet';
import { useDayStatus, usePrediction } from '@/hooks/use-prediction';
import { useToday } from '@/hooks/use-today';
import { formatDay, formatRange, isISODate, type ISODate } from '@/lib/dates';
import type { DayStatus } from '@/lib/day-status';
import { tapFeedback } from '@/lib/haptics';
import { useAppStore } from '@/store/app-store';
import { fonts, radius, space, useTheme } from '@/theme';

/** The line under the date: what this day is in the cycle. */
function describe(status: DayStatus): string | null {
  switch (status.kind) {
    case 'period':
      return `Period day ${status.day}${status.isEstimatedEnd ? ', end estimated' : ''}`;
    case 'expected-period':
      return `Period day ${status.day}, estimated`;
    case 'predicted-period':
      return `Period likely to start ${formatRange(status.window.from, status.window.to)}`;
    case 'ovulation':
      return 'Ovulation window, a rough estimate';
    case 'cycle-day':
      return `Cycle day ${status.day}`;
    case 'none':
      return null;
  }
}

export default function DayScreen() {
  const params = useLocalSearchParams<{ date: string }>();
  const today = useToday();
  const date: ISODate = isISODate(params.date) ? params.date : today;
  const isFuture = date > today;

  const { colors } = useTheme();
  const sheet = useSheet();
  const prediction = usePrediction(today);
  const status = useDayStatus(prediction, today)(date);
  const log = useAppStore((s) => s.record.logs[date]);
  const apply = useAppStore((s) => s.apply);
  const [note, setNoteText] = useState(log?.note ?? '');
  const [noteFocused, setNoteFocused] = useState(false);

  /** Only a logged day can be edited; days still to come wait until they're here. */
  const period = status.kind === 'period' ? status : null;
  const statusText = describe(status);

  /** Saved as it's typed, so every way out of the sheet keeps it. */
  const changeNote = (text: string) => {
    setNoteText(text);
    apply({ type: 'set-note', date, note: text });
  };
  const togglePeriodDay = () => {
    apply(period ? { type: 'unmark-period-day', date } : { type: 'mark-period-day', date });
    tapFeedback();
  };

  return (
    <Sheet
      sheet={sheet}
      keepEndAboveKeyboard
      eyebrow={date === today ? 'Today' : isFuture ? 'Upcoming' : (statusText ?? 'Log a day')}
      title={formatDay(date, { weekday: true, month: 'long', year: date.slice(0, 4) !== today.slice(0, 4) })}
      footer={<Button label="Done" icon="checkmark" onPress={sheet.close} />}>
      {(date === today || isFuture) && statusText ? (
        <Text variant="bodyStrong" tone="secondary" style={styles.status}>
          {statusText}
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
                disabled={period?.edge === 'middle'}
                onPress={togglePeriodDay}
                accessibilityHint={period ? 'Removes this day from the period' : 'Marks this day as a period day'}
              />
            </View>
            {period?.edge === 'middle' ? (
              <Text variant="caption" tone="secondary">
                This day is in the middle of a period. To shorten it, remove days from its start or use “Period ended
                on this day” on an earlier day.
              </Text>
            ) : null}
            <SectionTitle>Flow</SectionTitle>
            <FlowSelector value={log?.flow} onChange={(flow) => apply({ type: 'set-flow', date, flow })} />
            {period?.canEndHere ? (
              <View style={styles.row}>
                <TextButton
                  label="Period ended on this day"
                  icon="checkmark"
                  onPress={() => apply({ type: 'end-period', date })}
                />
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
                  onPress={() => apply({ type: 'toggle-symptom', date, id: s.id })}
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
                  onPress={() => apply({ type: 'toggle-mood', date, id: m.id })}
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
