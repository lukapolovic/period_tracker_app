import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, type DimensionValue } from 'react-native';

import { border, radius, space, useTheme } from '@/theme';

import { Text } from './text';

type PlaceholderKind = 'character' | 'animation' | 'illustration';

const ICONS = {
  character: 'happy-outline',
  animation: 'sparkles-outline',
  illustration: 'image-outline',
} as const;

type PlaceholderProps = {
  kind: PlaceholderKind;
  /** What the final artwork should show — a brief for the illustrator. */
  brief: string;
  width?: DimensionValue;
  height?: DimensionValue;
  shape?: 'rounded' | 'circle';
};

/**
 * Stand-in for character art and animations that haven't been drawn yet.
 * Decorative, so it's hidden from screen readers.
 */
export function Placeholder({ kind, brief, width = '100%', height = 160, shape = 'rounded' }: PlaceholderProps) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.box,
        {
          width,
          height,
          borderRadius: shape === 'circle' ? radius.pill : radius.card,
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.lineStrong,
        },
      ]}>
      <Ionicons name={ICONS[kind]} size={30} color={colors.textSecondary} />
      <Text variant="eyebrow" tone="secondary">
        {kind}
      </Text>
      <Text variant="caption" tone="secondary" align="center" numberOfLines={3}>
        {brief}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: border.width,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.md,
    gap: space.xs,
    alignSelf: 'center',
  },
});
