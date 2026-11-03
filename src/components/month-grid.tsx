import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { formatDay, monthMatrix, parts, weekdayInitials, type ISODate } from '@/lib/dates';
import { border, useTheme } from '@/theme';

/** `period` = logged (solid); `predicted` = estimate (dashed outline + tint, never colour-only). */
export type DayMark = 'none' | 'period' | 'predicted';

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

export function MonthGrid({ year, monthIndex, weekStartsOn, getDayInfo, onPressDay }: MonthGridProps) {
  const rows = monthMatrix(year, monthIndex, weekStartsOn);
  return (
    <View>
      <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {weekdayInitials(weekStartsOn).map((d, i) => (
          <Text key={i} variant="eyebrow" tone="secondary" align="center" style={styles.weekday}>
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
  if (info.hasLog) bits.push('has a log');
  return bits.join(', ');
}

function DayCell({ date, info, onPress }: { date: ISODate; info: DayInfo; onPress: (d: ISODate) => void }) {
  const { colors } = useTheme();
  const fill =
    info.mark === 'period'
      ? { backgroundColor: colors.period, borderColor: colors.period }
      : info.mark === 'predicted'
        ? { backgroundColor: colors.periodWash, borderColor: colors.period, borderStyle: 'dashed' as const }
        : { backgroundColor: 'transparent', borderColor: 'transparent' };
  const textColor =
    info.mark === 'period' ? colors.onPeriod : info.isFuture && info.mark === 'none' ? colors.textSecondary : colors.text;

  return (
    <Pressable
      style={styles.cell}
      disabled={info.disabled}
      onPress={() => onPress(date)}
      accessibilityRole="button"
      accessibilityLabel={describe(date, info)}
      accessibilityState={{ disabled: !!info.disabled }}>
      {({ pressed }) => (
        <View
          style={[
            styles.ring,
            info.isToday && { borderColor: colors.textStrong },
            pressed && styles.pressed,
            info.disabled && styles.disabled,
          ]}>
          <View style={[styles.circle, fill]}>
            <Text variant="bodyBold" style={[styles.number, { color: textColor }]}>
              {parts(date).day}
            </Text>
            {info.hasLog ? (
              <View
                style={[styles.dot, { backgroundColor: info.mark === 'period' ? colors.onPeriod : colors.textSecondary }]}
              />
            ) : null}
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  weekday: { flex: 1, paddingBottom: 6 },
  cell: { flex: 1, height: 50, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: border.width,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: border.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: { fontSize: 16, lineHeight: 20 },
  dot: { position: 'absolute', bottom: 3, width: 5, height: 5, borderRadius: 3 },
  pressed: { transform: [{ scale: 0.92 }] },
  disabled: { opacity: 0.35 },
});
