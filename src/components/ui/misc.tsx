import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { border, radius, space, useTheme } from '@/theme';

import type { IconName } from './button';
import { Chip } from './chip';
import { Text } from './text';

type SegmentedProps<T extends string | number> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function Segmented<T extends string | number>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.wrap}>
      {options.map((o) => (
        <Chip
          key={String(o.value)}
          role="radio"
          label={o.label}
          selected={o.value === value}
          onPress={() => onChange(o.value)}
        />
      ))}
    </View>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const { colors } = useTheme();
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={[styles.track, { backgroundColor: colors.line }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: colors.primary }]} />
    </View>
  );
}

type NoticeProps = { icon?: IconName; children: ReactNode; action?: ReactNode };

/** Quiet, inline information — the app never uses pop-ups for this. */
export function Notice({ icon = 'information-circle-outline', children, action }: NoticeProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.notice, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
      <Ionicons name={icon} size={22} color={colors.textSecondary} style={styles.noticeIcon} />
      <View style={styles.noticeBody}>
        {typeof children === 'string' ? <Text variant="body">{children}</Text> : children}
        {action}
      </View>
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text variant="eyebrow" tone="secondary" accessibilityRole="header">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  track: { height: 16, borderRadius: radius.pill, overflow: 'hidden', flex: 1 },
  fill: { height: '100%', borderRadius: radius.pill },
  notice: {
    flexDirection: 'row',
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.card,
    borderWidth: border.width,
  },
  noticeIcon: { marginTop: 1 },
  noticeBody: { flex: 1, gap: space.sm, alignItems: 'flex-start' },
});
