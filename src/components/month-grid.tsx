import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { formatDay, monthMatrix, parts, weekdayInitials, type ISODate } from '@/lib/dates';
import { fonts, radius, space, useTheme } from '@/theme';

/** `period` = logged (solid fill); `predicted` = estimate (dashed outline); `ovulation` = rough estimate (dotted). Never colour-only. */
export type DayMark = 'none' | 'period' | 'predicted' | 'ovulation';

export type DayInfo = {
  mark: DayMark;
  isToday: boolean;
  hasLog: boolean;
  isFuture: boolean;
  disabled?: boolean;
};

type MonthGridProps = {
  year: number;
  monthIndex: number;
  weekStartsOn: 0 | 1;
  getDayInfo: (date: ISODate) => DayInfo;
  onPressDay: (date: ISODate) => void;
};

/** A month of soft circles. */
export function MonthGrid({ year, monthIndex, weekStartsOn, getDayInfo, onPressDay }: MonthGridProps) {
  const rows = monthMatrix(year, monthIndex, weekStartsOn);
  return (
    <View style={styles.grid}>
      <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {weekdayInitials(weekStartsOn).map((d, i) => (
          <Text key={i} variant="caption" tone="secondary" align="center" style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((date, c) =>
            date ? (
              <DayCell key={date} date={date} info={getDayInfo(date)} onPress={onPressDay} />
            ) : (
              <View key={`empty-${c}`} style={styles.cell} />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

function describe(date: ISODate, info: DayInfo): string {
  const bits = [formatDay(date, { weekday: true, month: 'long' })];
  if (info.isToday) bits.push('today');
  if (info.mark === 'period') bits.push('period day');
  if (info.mark === 'predicted') bits.push('predicted period');
  if (info.mark === 'ovulation') bits.push('estimated ovulation window');
  if (info.hasLog) bits.push('has a log');
  return bits.join(', ');
}

function DayCell({ date, info, onPress }: { date: ISODate; info: DayInfo; onPress: (d: ISODate) => void }) {
  const { colors } = useTheme();
  const isPeriod = info.mark === 'period';
  const outline =
    info.mark === 'predicted'
      ? { borderColor: colors.periodLine, borderStyle: 'dashed' as const }
      : info.mark === 'ovulation'
        ? { borderColor: colors.ovulationLine, borderStyle: 'dotted' as const }
        : info.isToday
          ? { borderColor: colors.ink }
          : { borderColor: 'transparent' };
  const fill = isPeriod ? colors.period : info.isToday ? colors.structure : 'transparent';
  const textColor = isPeriod
    ? colors.onPeriod
    : info.isToday
      ? colors.onStructure
      : info.disabled || (info.isFuture && info.mark === 'none')
        ? colors.textSecondary
        : colors.ink;

  return (
    <Pressable
      disabled={info.disabled}
      onPress={() => onPress(date)}
      accessibilityRole="button"
      accessibilityLabel={describe(date, info)}
      accessibilityState={{ disabled: !!info.disabled }}
      style={({ pressed }) => [
        styles.cell,
        styles.day,
        outline,
        { backgroundColor: pressed && !isPeriod && !info.isToday ? colors.canvas : fill },
      ]}>
      <Text style={[styles.number, { color: textColor }]}>{parts(date).day}</Text>
      {info.hasLog ? (
        <View style={[styles.dot, { backgroundColor: isPeriod || info.isToday ? colors.ink : colors.textSecondary }]} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 2 },
  row: { flexDirection: 'row', gap: 2 },
  weekday: { flex: 1, paddingBottom: space[1] },
  cell: { flex: 1, aspectRatio: 1 },
  day: {
    borderWidth: 1.5,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 18 },
  dot: { position: 'absolute', bottom: 5, width: 4, height: 4, borderRadius: 2 },
});
