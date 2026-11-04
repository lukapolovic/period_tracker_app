import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, space, useTheme } from '@/theme';

import { Text } from './text';

type CardProps = {
  children: ReactNode;
  title?: string;
  /** Optional element on the right of the title, e.g. an edit button. */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** White on cream. Depth comes from the surface change and the radius, never a shadow. */
export function Card({ children, title, action, style }: CardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, style]}>
      {title ? (
        <View style={styles.header}>
          <Text variant="headingSm" accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {action}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    paddingHorizontal: space[6],
    paddingVertical: space[8],
    gap: space[4],
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: space[2], minHeight: 36 },
  title: { flex: 1 },
});
