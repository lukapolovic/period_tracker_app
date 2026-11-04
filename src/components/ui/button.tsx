import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { radius, size, space, useTheme, type ColorTokens } from '@/theme';

import { Text } from './text';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/** `destructive` looks like `secondary` with a trash icon; the screen adds a confirmation step. */
type Variant = 'primary' | 'secondary' | 'destructive';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  /** Sits in the circle at the end of the button. */
  icon?: IconName;
  disabled?: boolean;
  /** Secondary buttons are cream inside a white card and white out on the canvas. */
  onCanvas?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

function look(colors: ColorTokens, variant: Variant, disabled?: boolean, onCanvas?: boolean) {
  if (disabled) return { fill: colors.surfaceAlt, text: colors.textSecondary, dot: colors.canvas, glyph: colors.textSecondary };
  if (variant === 'primary') return { fill: colors.action, text: colors.onAction, dot: colors.actionDot, glyph: colors.onAction };
  return { fill: onCanvas ? colors.surface : colors.canvas, text: colors.ink, dot: colors.structure, glyph: colors.onStructure };
}

const PRESS = { damping: 18, stiffness: 320, mass: 0.6 };

/** A pill with its label on the left and a small circle on the right. The circle slides on press. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon = 'chevron-forward',
  disabled,
  onCanvas,
  accessibilityHint,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const c = look(colors, variant, disabled, onCanvas);
  const glyph = variant === 'destructive' ? 'trash-outline' : icon;
  const pressed = useSharedValue(0);

  const body = useAnimatedStyle(() => ({ transform: [{ scale: 1 - pressed.get() * 0.025 }] }));
  const dot = useAnimatedStyle(() => ({ transform: [{ translateX: pressed.get() * 5 }] }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => pressed.set(withSpring(1, PRESS))}
      onPressOut={() => pressed.set(withSpring(0, PRESS))}
      style={style}>
      <Animated.View style={[styles.base, { backgroundColor: c.fill }, body]}>
        <Text variant="button" style={[styles.label, { color: c.text }]} numberOfLines={2}>
          {label}
        </Text>
        <Animated.View style={[styles.dot, { backgroundColor: c.dot }, dot]}>
          <Ionicons name={glyph} size={20} color={c.glyph} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

type TextButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  /** On the canvas a ribbon may pass behind it, so it sits on a small white pill. */
  onCanvas?: boolean;
  accessibilityHint?: string;
};

/** Quiet action: an underlined ink label, no box. */
export function TextButton({ label, onPress, icon, onCanvas, accessibilityHint }: TextButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.textButton,
        onCanvas && [styles.textPill, { backgroundColor: colors.surface }],
        pressed && styles.pressed,
      ]}>
      {icon ? <Ionicons name={icon} size={18} color={colors.ink} /> : null}
      <View style={[styles.underline, { borderBottomColor: colors.ink }]}>
        <Text variant="label">{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: size.button,
    borderRadius: radius.full,
    paddingLeft: space[6],
    paddingRight: space[2],
    paddingVertical: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  label: { flex: 1 },
  dot: {
    width: size.buttonDot,
    height: size.buttonDot,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    minHeight: size.touch,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
    paddingHorizontal: space[1],
  },
  textPill: { alignSelf: 'center', paddingHorizontal: space[5], borderRadius: radius.full },
  pressed: { opacity: 0.55 },
  underline: { borderBottomWidth: 1 },
});
