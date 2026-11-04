import { Canvas } from '@shopify/react-native-skia';
import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { tapFeedback } from '@/lib/haptics';
import { canvasOverlay, useTheme } from '@/theme';

import { Clouds, Field } from './field';
import { PAGE_COUNT, useFlow } from './flow-provider';
import { RibbonLayer } from './ribbon-canvas';
import { useRibbonSim } from './ribbon-sim';
import { ALL_RIBBONS, ribbonOffsets } from './world';

const SETTLE = { damping: 26, stiffness: 120, mass: 1 };

type FlowStageProps = {
  /** One element per page, laid out side by side. */
  pages: ReactNode[];
  /** Fixed above everything: the nav bar. */
  chrome?: ReactNode;
  swipeable?: boolean;
};

/**
 * The one page. Back to front: ribbons, the pannable pages, the ribbon stretches that cross over the
 * content, the field, and the nav.
 */
export function FlowStage({ pages, chrome, swipeable = true }: FlowStageProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const flow = useFlow();
  const { width, height, progress, scrollY, rise, lift, reduceMotion, setPage } = flow;

  const offsets = useMemo(() => ribbonOffsets(ALL_RIBBONS), []);
  const state = useRibbonSim(ALL_RIBBONS, flow);

  const dragStart = useSharedValue(0);
  const last = pages.length - 1;

  const pan = usePanGesture({
    enabled: swipeable,
    activeOffsetX: [-14, 14],
    failOffsetY: [-14, 14],
    onActivate: () => {
      'worklet';
      dragStart.set(progress.get());
    },
    onUpdate: (e) => {
      'worklet';
      const raw = dragStart.get() - e.translationX / width;
      // Past either end the page gives way less and less.
      const over = raw < 0 ? raw : raw > last ? raw - last : 0;
      progress.set(over === 0 ? raw : (raw < 0 ? 0 : last) + over * 0.3);
    },
    onDeactivate: (e) => {
      'worklet';
      const velocity = -e.velocityX / width;
      const projected = progress.get() + velocity * 0.22;
      const start = Math.round(dragStart.get());
      const target = Math.min(Math.max(Math.round(projected), Math.max(start - 1, 0)), Math.min(start + 1, last));
      scheduleOnRN(setPage, target);
      if (target !== start) scheduleOnRN(tapFeedback);
      progress.set(withSpring(target, { ...SETTLE, velocity, reduceMotion: undefined }));
    },
  });

  const row = useAnimatedStyle(() => ({ transform: [{ translateX: -progress.get() * width }] }));

  // Flowers lean against the direction of travel, then spring back.
  const sway = useDerivedValue(() => {
    const s = state.get();
    return reduceMotion ? 0 : Math.max(-0.3, Math.min(0.3, s.vx[0] * 0.0004));
  });

  return (
    <View style={[styles.stage, { backgroundColor: colors.canvas }]}>
      <Canvas style={canvasOverlay}>
        <RibbonLayer specs={ALL_RIBBONS} offsets={offsets} state={state} width={width} colors={colors} front={false} />
      </Canvas>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.row, { width: width * PAGE_COUNT }, row]}>
          {pages.map((page, i) => (
            <View key={i} style={{ width, height }}>
              {page}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>

      <Canvas style={canvasOverlay}>
        <RibbonLayer specs={ALL_RIBBONS} offsets={offsets} state={state} width={width} colors={colors} front />
        <Field
          colors={colors}
          width={width}
          height={height}
          bottomInset={insets.bottom}
          progress={progress}
          rise={rise}
          lift={lift}
          sway={sway}
        />
        <Clouds colors={colors} width={width} topInset={insets.top} progress={progress} scrollY={scrollY} />
      </Canvas>

      {chrome}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', flex: 1 },
});
