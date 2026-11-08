import { router } from 'expo-router';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewInstance,
} from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { IconButton, Text } from '@/components/ui';
import { goBack } from '@/lib/navigation';
import { gutter, maxContentWidth, radius, space, useTheme } from '@/theme';

import { useFlow } from './flow-provider';

const OPEN = { damping: 28, stiffness: 170, mass: 1 };
/** The strip of the world left showing above an open sheet. */
const PEEK = 56;

/** Drives a sheet: rises on mount, sinks on `close`, and takes the ribbons with it. */
export function useSheet() {
  const { lift, reduceMotion } = useFlow();
  const shown = useSharedValue(0);

  useEffect(() => {
    const spring = reduceMotion ? withTiming(1, { duration: 1 }) : withSpring(1, OPEN);
    shown.set(spring);
    lift.set(reduceMotion ? 1 : withSpring(1, OPEN));
    return () => {
      lift.set(0);
    };
  }, [lift, shown, reduceMotion]);

  const close = useCallback(() => {
    Keyboard.dismiss();
    const config = { duration: reduceMotion ? 1 : 340, easing: Easing.bezier(0.5, 0, 0.8, 0.4) };
    lift.set(withTiming(0, config));
    shown.set(
      withTiming(0, config, (finished) => {
        if (finished) scheduleOnRN(goBack);
      }),
    );
  }, [lift, shown, reduceMotion]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => sub.remove();
  }, [close]);

  return { shown, close };
}

type SheetProps = {
  sheet: ReturnType<typeof useSheet>;
  title: string;
  eyebrow?: string;
  /** Pinned below the scrolling content, e.g. a Done button. */
  footer?: ReactNode;
  children: ReactNode;
};

/** A cream page that rises over the world. Drag the handle down, tap outside or use the button to leave. */
export function Sheet({ sheet, title, eyebrow, footer, children }: SheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useFlow();
  const { shown, close } = sheet;
  const drag = useSharedValue(0);
  const scroll = useRef<ScrollViewInstance>(null);

  const top = insets.top + PEEK;
  const travel = height - top;

  // Text fields sit last in a sheet, so the end is the part to show while the keyboard is up.
  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', () => scroll.current?.scrollToEnd());
    return () => sub.remove();
  }, []);

  const pull = usePanGesture({
    onUpdate: (e) => {
      'worklet';
      drag.set(Math.max(e.translationY, 0));
    },
    onDeactivate: (e) => {
      'worklet';
      if (e.translationY > 120 || e.velocityY > 900) scheduleOnRN(close);
      drag.set(withSpring(0, OPEN));
    },
  });

  const body = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - shown.get()) * travel + drag.get() }],
  }));
  const scrim = useAnimatedStyle(() => ({ opacity: shown.get() }));

  return (
    <View style={StyleSheet.absoluteFill} accessibilityViewIsModal>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }, scrim]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.fill} onPress={close} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { top, backgroundColor: colors.canvas }, body]}>
        {/* It measures from the sheet, not the screen, hence `top`. The footer's safe-area padding can sit behind the keyboard. */}
        <KeyboardAvoidingView style={styles.fill} behavior="padding" keyboardVerticalOffset={top - insets.bottom}>
          <GestureDetector gesture={pull}>
            <View style={styles.head}>
              <View style={[styles.handle, { backgroundColor: colors.surfaceAlt }]} />
              <View style={styles.headRow}>
                <View style={styles.headText}>
                  {eyebrow ? (
                    <Text variant="label" tone="secondary">
                      {eyebrow}
                    </Text>
                  ) : null}
                  <Text variant="headingSm" accessibilityRole="header">
                    {title}
                  </Text>
                </View>
                <IconButton icon="close" label="Close" onPress={close} />
              </View>
            </View>
          </GestureDetector>
          <ScrollView
            ref={scroll}
            style={styles.fill}
            contentContainerStyle={[styles.content, { paddingBottom: (footer ? 0 : insets.bottom) + space[8] }]}
            onContentSizeChange={() => {
              if (Keyboard.isVisible()) scroll.current?.scrollToEnd();
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {footer ? (
            <View style={[styles.footer, { paddingBottom: insets.bottom + space[3] }]}>
              <View style={styles.column}>{footer}</View>
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

/** Opens a route as a sheet, leaving the one page mounted underneath. */
export const openDay = (date: string) => router.push({ pathname: '/day/[date]', params: { date } });
export const openHowItWorks = () => router.push('/how-it-works');

const styles = StyleSheet.create({
  fill: { flex: 1 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    overflow: 'hidden',
  },
  head: { paddingHorizontal: space[6], paddingTop: space[3], paddingBottom: space[3], gap: space[3] },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: radius.full },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  headText: { flex: 1, gap: 2 },
  content: {
    paddingHorizontal: gutter,
    gap: space[4],
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
  footer: { paddingHorizontal: gutter, paddingTop: space[3] },
  column: { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center', gap: space[3] },
});
