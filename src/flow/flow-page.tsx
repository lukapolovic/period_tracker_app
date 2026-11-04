import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gutter, maxContentWidth, space } from '@/theme';

import { FIELD_CLEARANCE } from './field';
import { useFlow } from './flow-provider';

/** How far from the end of a page the field starts to grow. */
const RISE_DISTANCE = 240;

type FlowPageProps = {
  index: number;
  children: ReactNode;
  /** Floating content pinned to the page, e.g. a snackbar. */
  overlay?: ReactNode;
};

/** One stop on the pan: a transparent scroll view, so the ribbons show through. */
export function FlowPage({ index, children, overlay }: FlowPageProps) {
  const insets = useSafeAreaInsets();
  const { offsets, ends, page } = useFlow();
  const inView = page === index;

  const contentHeight = useSharedValue(0);
  const viewHeight = useSharedValue(0);

  const report = (y: number) => {
    'worklet';
    const room = contentHeight.get() - viewHeight.get();
    const left = Math.max(room - y, 0);
    const end = Math.min(Math.max(1 - left / RISE_DISTANCE, 0), 1);
    offsets.modify((list) => {
      'worklet';
      list[index] = y;
      return list;
    }, true);
    ends.modify((list) => {
      'worklet';
      list[index] = end;
      return list;
    }, true);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      contentHeight.set(e.contentSize.height);
      viewHeight.set(e.layoutMeasurement.height);
      report(e.contentOffset.y);
    },
  });

  return (
    // Off-screen pages leave the accessibility tree, so a screen reader stays on the page in view.
    <View
      style={styles.page}
      pointerEvents={inView ? 'auto' : 'none'}
      accessibilityElementsHidden={!inView}
      importantForAccessibility={inView ? 'auto' : 'no-hide-descendants'}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={(_, h) => {
          contentHeight.set(h);
        }}
        onLayout={(e) => {
          viewHeight.set(e.nativeEvent.layout.height);
        }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space[3], paddingBottom: insets.bottom + FIELD_CLEARANCE },
        ]}>
        {children}
      </Animated.ScrollView>
      {overlay}
    </View>
  );
}

type DriftProps = {
  page: number;
  /**
   * Share of a page width this element trails behind the pan. Positive feels further away,
   * negative rushes ahead of the page.
   */
  amount?: number;
  /** Share of the page's scroll it trails by. */
  scroll?: number;
  /** Shrinks a little when off centre, as if arriving from further back. */
  arrive?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/** Gives an element its own speed, so a page moves in layers instead of as one sheet. */
export function Drift({ page, amount = 0.1, scroll = 0, arrive = false, style, children }: DriftProps) {
  const { progress, width, offsets, reduceMotion } = useFlow();
  const motion = useAnimatedStyle(() => {
    if (reduceMotion) return {};
    const d = progress.get() - page;
    const scale = arrive ? 1 - Math.min(Math.abs(d), 1) * 0.14 : 1;
    return {
      transform: [
        { translateX: d * width * amount },
        { translateY: scroll ? offsets.get()[page] * scroll : 0 },
        { scale },
      ],
    };
  });
  return <Animated.View style={[style, motion]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: {
    paddingHorizontal: gutter,
    gap: space[6],
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
});
