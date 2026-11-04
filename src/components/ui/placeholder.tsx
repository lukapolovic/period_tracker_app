import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, type DimensionValue } from 'react-native';

import { radius, space, useTheme } from '@/theme';

import { Text } from './text';

type PlaceholderProps = {
  /** What the final artwork should show — a brief for the illustrator. */
  brief: string;
  width?: DimensionValue;
  height?: DimensionValue;
};

/** Stand-in for art that hasn't been drawn yet. Decorative, so it's hidden from screen readers. */
export function Placeholder({ brief, width = '100%', height = 160 }: PlaceholderProps) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.box, { width, height, borderColor: colors.textSecondary }]}>
      <Ionicons name="image-outline" size={26} color={colors.textSecondary} />
      <Text variant="caption" tone="secondary" align="center" numberOfLines={3}>
        {brief}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.inset,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[3],
    gap: space[1],
  },
});
