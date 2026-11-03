import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/components/ui';
import { border, fonts, radius, useTheme } from '@/theme';

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.icon,
        focused && { backgroundColor: colors.linkWash, borderColor: colors.linkBorder },
      ]}>
      <Ionicons name={name} size={24} color={focused ? colors.link : colors.textSecondary} />
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.link,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          borderTopWidth: border.width,
          height: 78 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom || 10,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.heavy,
          fontSize: 11,
          lineHeight: 14,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          marginTop: 4,
        },
        tabBarIconStyle: { width: 56, height: 34 },
        sceneStyle: { backgroundColor: colors.canvas },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'sunny' : 'sunny-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'calendar' : 'calendar-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 56,
    height: 34,
    borderRadius: radius.control,
    borderWidth: border.width,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
