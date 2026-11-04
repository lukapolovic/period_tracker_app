import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { useTheme } from '@/theme';

type CycleRingProps = {
  /** Days shown around the ring. */
  totalDays: number;
  /** Today's position (1-based); null when nothing is logged yet. */
  cycleDay: number | null;
  /** Period days from day 1, including any estimated days still to come. */
  periodDays: number;
  /** Predicted start window as 1-based day numbers within this cycle. */
  window: { fromDay: number; toDay: number } | null;
  /** Screen-reader summary of the ring. */
  label: string;
  size: number;
  children?: ReactNode;
};

const TRACK = 11;
const MARK = 9;

function polar(c: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: c + r * Math.cos(rad), y: c + r * Math.sin(rad) };
}

function arcPath(c: number, r: number, from: number, to: number) {
  const s = polar(c, r, from);
  const e = polar(c, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

/**
 * The current cycle as a soft ring: logged period days solid, estimates dashed, today an ink bead.
 * Estimates are always dashed, so the ring never relies on colour alone.
 */
export function CycleRing({ totalDays, cycleDay, periodDays, window, label, size, children }: CycleRingProps) {
  const { colors } = useTheme();
  const c = size / 2;
  const r = c - MARK - 1;
  const perDay = 360 / Math.max(totalDays, 1);

  const segment = (fromDay: number, toDay: number, dashed: boolean) => {
    if (toDay < fromDay) return null;
    const from = (fromDay - 1) * perDay;
    const to = Math.min(toDay * perDay, from + 359.9);
    return (
      <Path
        key={`${fromDay}-${toDay}-${dashed ? 'd' : 's'}`}
        d={arcPath(c, r, from, to)}
        stroke={dashed ? colors.periodLine : colors.period}
        strokeWidth={dashed ? 5 : TRACK}
        strokeDasharray={dashed ? '6 7' : undefined}
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  const today = cycleDay ?? 0;
  const loggedPeriod = Math.min(periodDays, today);
  const mark = cycleDay ? polar(c, r, (cycleDay - 0.5) * perDay) : null;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={c} cy={c} r={r} stroke={colors.surfaceAlt} strokeWidth={TRACK} fill="none" />
        {window ? segment(window.fromDay, window.toDay, true) : null}
        {periodDays > today ? segment(today + 1, periodDays, true) : null}
        {loggedPeriod > 0 ? segment(1, loggedPeriod, false) : null}
        {mark ? <Circle cx={mark.x} cy={mark.y} r={MARK} fill={colors.ink} stroke={colors.surface} strokeWidth={3} /> : null}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: TRACK + MARK },
});
