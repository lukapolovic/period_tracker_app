import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tapFeedback } from '@/lib/haptics';
import { gutter, maxContentWidth, radius, size, space, typeScale, useTheme } from '@/theme';

import { useFlow } from './flow-provider';
import { STOPS } from './stops';

const INSET = (size.nav - size.navItem) / 2;

type TabProps = {
  label: string;
  page: number;
  selected: boolean;
  onPress: () => void;
};

/** Its label follows the pan like the blob does, so the colour turns as the blob crosses it. */
function Tab({ label, page, selected, onPress }: TabProps) {
  const { colors } = useTheme();
  const { progress } = useFlow();
  const { ink, onStructure } = colors;

  const tint = useAnimatedStyle(() => ({
    color: interpolateColor(Math.abs(progress.get() - page), [0.35, 0.65], [onStructure, ink]),
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={styles.tab}>
      <Animated.Text
        numberOfLines={1}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1.3}
        style={[typeScale.label, tint]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

/**
 * The floating white pill. A green blob marks the page in view: it follows the pan itself, stretching
 * between stops. The tabs share the bar equally, so the blob's position comes straight from the pan and
 * only the bar's width needs measuring.
 */
export function NavBar() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { progress, page, goTo } = useFlow();
  const [barWidth, setBarWidth] = useState(0);
  const tabWidth = (barWidth - INSET * 2) / STOPS.length;

  const blob = useAnimatedStyle(() => {
    const p = Math.min(Math.max(progress.get(), 0), STOPS.length - 1);
    const between = Math.abs(p - Math.round(p));
    return {
      width: tabWidth + between * 26,
      transform: [{ translateX: INSET + p * tabWidth - between * 13 }, { scaleY: 1 - between * 0.16 }],
    };
  });

  const go = (target: number) => {
    if (target !== page) tapFeedback();
    goTo(target);
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + space[3] }]}>
      <View
        accessibilityRole="tablist"
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        style={[styles.bar, { backgroundColor: colors.surface }]}>
        {barWidth > 0 ? <Animated.View style={[styles.blob, { backgroundColor: colors.structure }, blob]} /> : null}
        {STOPS.map((stop, i) => (
          <Tab key={stop.key} label={stop.label} page={i} selected={page === i} onPress={() => go(i)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: gutter, right: gutter, alignItems: 'center' },
  bar: {
    width: '100%',
    maxWidth: maxContentWidth,
    height: size.nav,
    borderRadius: radius.full,
    paddingHorizontal: INSET,
    flexDirection: 'row',
    alignItems: 'center',
  },
  blob: { position: 'absolute', left: 0, top: INSET, height: size.navItem, borderRadius: radius.full },
  tab: {
    flex: 1,
    height: size.navItem,
    paddingHorizontal: space[1],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
});
