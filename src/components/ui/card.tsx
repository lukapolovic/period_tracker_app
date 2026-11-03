import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { border, radius, space, useTheme } from '@/theme';

import { Text } from './text';

type CardProps = {
  children: ReactNode;
  title?: string;
  /** Optional element on the right of the title, e.g. an edit button. */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, title, action, style }: CardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }, style]}>
      {title ? (
        <View style={styles.header}>
          <Text variant="subheading" tone="strong" accessibilityRole="header" style={styles.title}>
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
    borderWidth: border.width,
    borderRadius: radius.card,
    padding: space.lg,
    gap: space.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 32 },
  title: { flex: 1 },
});
