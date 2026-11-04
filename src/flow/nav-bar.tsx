import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { tapFeedback } from '@/lib/haptics';
import { gutter, maxContentWidth, radius, size, space, useTheme } from '@/theme';

import { Pages, useFlow } from './flow-provider';

const TABS = [
  { label: 'Today', page: Pages.today },
  { label: 'Calendar', page: Pages.calendar },
  { label: 'History', page: Pages.history },
  { label: 'Settings', page: Pages.settings },
];

const INSET = (size.nav - size.navItem) / 2;

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
  const tabWidth = (barWidth - INSET * 2) / TABS.length;

  const blob = useAnimatedStyle(() => {
    const p = Math.min(Math.max(progress.get(), 0), TABS.length - 1);
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
        {TABS.map((tab) => (
          <Pressable
            key={tab.label}
            onPress={() => go(tab.page)}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: page === tab.page }}
            style={styles.tab}>
            <Text
              variant="label"
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.3}
              style={page === tab.page && { color: colors.onStructure }}>
              {tab.label}
            </Text>
          </Pressable>
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
