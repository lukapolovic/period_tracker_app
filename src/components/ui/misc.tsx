import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import { fonts, radius, size, space, useTheme } from '@/theme';

import type { IconName } from './button';
import { Text } from './text';

type SegmentedProps<T extends string | number> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** Recessed track with a white thumb that slides to the chosen option. */
export function Segmented<T extends string | number>({ label, options, value, onChange }: SegmentedProps<T>) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const index = options.findIndex((o) => o.value === value);
  const thumbWidth = width / options.length;
  const x = useDerivedValue(() => withSpring(index * thumbWidth, { damping: 20, stiffness: 220 }));
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width - TRACK_PAD * 2)}
      style={[styles.segmented, { backgroundColor: colors.surfaceAlt }]}>
      {width > 0 ? (
        <Animated.View style={[styles.thumb, { width: thumbWidth, backgroundColor: colors.surface }, thumb]} />
      ) : null}
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(o.value)}
            style={styles.segment}>
            <Text variant="label" tone={selected ? 'default' : 'secondary'} align="center">
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type ToggleProps = {
  label: string;
  /** What it does, in a line. */
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

/** A setting that's either on or off. */
export function Toggle({ label, hint, value, onChange, disabled }: ToggleProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.toggle}>
      <View style={styles.toggleText}>
        <Text variant="bodyStrong">{label}</Text>
        <Text variant="caption" tone="secondary">
          {hint}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        accessibilityLabel={label}
        accessibilityHint={hint}
        trackColor={{ false: colors.surfaceAlt, true: colors.structure }}
        ios_backgroundColor={colors.surfaceAlt}
        thumbColor={colors.actionDot}
      />
    </View>
  );
}

/** A filled track. The steps of onboarding, nothing else. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const { colors } = useTheme();
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={[styles.track, { backgroundColor: colors.surface }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: colors.ink }]} />
    </View>
  );
}

type NoticeProps = { icon?: IconName; children: ReactNode; action?: ReactNode };

/** Quiet, inline information on a white pill card, marked with a single green dot. Never a pop-up. */
export function Notice({ icon = 'information', children, action }: NoticeProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.notice, { backgroundColor: colors.surface }]}>
      <View style={[styles.noticeDot, { backgroundColor: colors.structure }]}>
        <Ionicons name={icon} size={18} color={colors.onStructure} />
      </View>
      <View style={styles.noticeBody}>
        {typeof children === 'string' ? <Text variant="body">{children}</Text> : children}
        {action}
      </View>
    </View>
  );
}

type BadgeProps = { label: string; dashed?: boolean };

/** A one- or two-word tag. `dashed` marks estimates. */
export function Badge({ label, dashed }: BadgeProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.badge, { borderColor: colors.ink, backgroundColor: colors.surface }, dashed && styles.dashed]}>
      <Text style={[styles.badgeText, { color: colors.ink }]}>{label}</Text>
    </View>
  );
}

/** One or two plain sentences, always beside a character, tail pointing down at it. */
export function SpeechBubble({ children }: { children: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.bubble, { backgroundColor: colors.surface }]}>
      <Text variant="body">{children}</Text>
      <View style={[styles.tail, { backgroundColor: colors.surface }]} />
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text variant="label" tone="secondary" accessibilityRole="header">
      {children}
    </Text>
  );
}

const TRACK_PAD = 4;

const styles = StyleSheet.create({
  segmented: { flexDirection: 'row', borderRadius: radius.full, padding: TRACK_PAD },
  thumb: { position: 'absolute', left: TRACK_PAD, top: TRACK_PAD, bottom: TRACK_PAD, borderRadius: radius.full },
  segment: { flex: 1, minHeight: size.touch, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space[2] },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: space[4], minHeight: size.touch },
  toggleText: { flex: 1, gap: 2 },
  track: { height: 12, borderRadius: radius.full, overflow: 'hidden', flex: 1 },
  fill: { height: '100%', borderRadius: radius.full },
  notice: {
    flexDirection: 'row',
    gap: space[3],
    paddingVertical: space[4],
    paddingHorizontal: space[5],
    borderRadius: radius.inset + 8,
    alignItems: 'flex-start',
  },
  noticeDot: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  noticeBody: { flex: 1, gap: space[2], alignItems: 'flex-start', paddingTop: 5 },
  badge: { borderWidth: 1, borderRadius: radius.small, paddingHorizontal: space[2], paddingVertical: 2 },
  dashed: { borderStyle: 'dashed' },
  badgeText: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: 280,
    borderRadius: radius.inset + 6,
    paddingHorizontal: space[5],
    paddingVertical: space[4],
    marginBottom: 10,
  },
  tail: {
    position: 'absolute',
    left: 40,
    bottom: -7,
    width: 18,
    height: 18,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
});
