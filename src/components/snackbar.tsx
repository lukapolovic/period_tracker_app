import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { gutter, maxContentWidth, radius, size, space, useTheme } from '@/theme';

export type SnackState = { message: string; actionLabel?: string; onAction?: () => void };

export function useSnackbar(timeoutMs = 6000) {
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

/** Ink pill docked just above the nav, with an optional action (used for Undo). */
export function Snackbar({ snack, onHide }: { snack: SnackState | null; onHide: () => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  if (!snack) return null;
  return (
    <View style={[styles.wrap, { bottom: insets.bottom + size.nav + space[6] }]} pointerEvents="box-none">
      <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={[styles.bar, { backgroundColor: colors.ink }]}>
        <Text variant="body" tone="inverse" style={styles.message}>
          {snack.message}
        </Text>
        {snack.actionLabel && snack.onAction ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={snack.actionLabel}
            hitSlop={4}
            style={[styles.action, { backgroundColor: colors.action }]}
            onPress={() => {
              snack.onAction?.();
              onHide();
            }}>
            <Text variant="label" tone="onAction">
              {snack.actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: gutter, right: gutter, alignItems: 'center' },
  bar: {
    width: '100%',
    maxWidth: maxContentWidth,
    minHeight: size.nav - 4,
    borderRadius: radius.full,
    paddingLeft: space[6],
    paddingRight: space[2],
    paddingVertical: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  message: { flex: 1 },
  action: {
    minHeight: size.touch,
    justifyContent: 'center',
    paddingHorizontal: space[5],
    borderRadius: radius.full,
  },
});
