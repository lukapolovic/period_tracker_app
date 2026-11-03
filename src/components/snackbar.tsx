import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { maxContentWidth, radius, space, useTheme } from '@/theme';

export type SnackState = { message: string; actionLabel?: string; onAction?: () => void };

export function useSnackbar(timeoutMs = 5000) {
  const [snack, setSnack] = useState<SnackState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setSnack(null);
  }, []);

  const show = useCallback(
    (next: SnackState) => {
      if (timer.current) clearTimeout(timer.current);
      setSnack(next);
      timer.current = setTimeout(() => setSnack(null), timeoutMs);
    },
    [timeoutMs],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { snack, show, hide };
}

/** Bottom message with an optional action (used for Undo). */
export function Snackbar({ snack, onHide }: { snack: SnackState | null; onHide: () => void }) {
  const { colors } = useTheme();
  if (!snack) return null;
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={[styles.bar, { backgroundColor: colors.inverseSurface }]}>
        <Text variant="bodyBold" tone="onInverse" style={styles.message}>
          {snack.message}
        </Text>
        {snack.actionLabel && snack.onAction ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={snack.actionLabel}
            hitSlop={8}
            onPress={() => {
              snack.onAction?.();
              onHide();
            }}>
            <Text variant="label" tone="inverseAction">
              {snack.actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: space.lg, right: space.lg, bottom: space.lg, alignItems: 'center' },
  bar: {
    width: '100%',
    maxWidth: maxContentWidth - space.xxl,
    minHeight: 56,
    borderRadius: radius.control,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  message: { flex: 1 },
});
