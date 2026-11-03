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
  size?: number;
  children?: ReactNode;
};

const STROKE = 18;

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
 * The current cycle as a ring: solid period days, a dotted predicted window and a knob for today.
 * Estimates are always dotted, so the ring never relies on colour alone.
 */
export function CycleRing({ totalDays, cycleDay, periodDays, window, label, size = 236, children }: CycleRingProps) {
  const { colors } = useTheme();
  const c = size / 2;
  const r = (size - STROKE) / 2 - 5;
  const perDay = 360 / Math.max(totalDays, 1);
  // Round caps poke out past the path ends; trim them so neighbouring segments don't touch.
  const cap = (STROKE / 2 / (2 * Math.PI * r)) * 360 + 1.2;

  const segment = (fromDay: number, toDay: number, color: string, extra?: { dotted?: boolean }) => {
    if (toDay < fromDay) return null;
    const from = (fromDay - 1) * perDay + cap;
    const to = toDay * perDay - cap;
    const key = `${color}-${fromDay}-${toDay}-${extra?.dotted ? 'd' : 's'}`;
    if (extra?.dotted) {
      return (
        <Path
          key={key}
          d={arcPath(c, r, (fromDay - 1) * perDay + 2, toDay * perDay - 2)}
          stroke={color}
          strokeWidth={STROKE * 0.42}
          strokeLinecap="round"
          strokeDasharray={`0.1 ${STROKE * 0.85}`}
          fill="none"
        />
      );
    }
    if (to <= from) {
      const mid = polar(c, r, ((fromDay - 1 + toDay) / 2) * perDay);
      return <Circle key={key} cx={mid.x} cy={mid.y} r={STROKE / 2} fill={color} />;
    }
    return (
      <Path key={key} d={arcPath(c, r, from, to)} stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
    );
  };

  const today = cycleDay ?? 0;
  const loggedPeriod = Math.min(periodDays, today);
  const knob = cycleDay ? polar(c, r, (cycleDay - 0.5) * perDay) : null;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={c} cy={c} r={r} stroke={colors.line} strokeWidth={STROKE} fill="none" />
        {window ? segment(window.fromDay, window.toDay, colors.periodWash) : null}
        {window ? segment(window.fromDay, window.toDay, colors.period, { dotted: true }) : null}
        {periodDays > today ? segment(today + 1, periodDays, colors.periodWash) : null}
        {periodDays > today ? segment(today + 1, periodDays, colors.period, { dotted: true }) : null}
        {today > periodDays ? segment(periodDays + 1, today, colors.primary) : null}
        {loggedPeriod > 0 ? segment(1, loggedPeriod, colors.period) : null}
        {knob ? (
          <Circle cx={knob.x} cy={knob.y} r={STROKE / 2 + 3} fill={colors.surface} stroke={colors.textStrong} strokeWidth={4} />
        ) : null}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
