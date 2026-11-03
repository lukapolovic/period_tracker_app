import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { maxContentWidth, space, useTheme } from '@/theme';

import { Text } from './text';

type ScreenProps = {
  children: ReactNode;
  /** Pinned below the scrolling content, e.g. a Done button. */
  footer?: ReactNode;
  /** Floating content such as a snackbar. */
  overlay?: ReactNode;
  edges?: Edge[];
};

export function Screen({ children, footer, overlay, edges = ['top'] }: ScreenProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: colors.canvas }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        {children}
      </ScrollView>
      {footer ? (
        <View style={[styles.footer, { borderTopColor: colors.line, backgroundColor: colors.canvas }]}>
          <View style={styles.column}>{footer}</View>
        </View>
      ) : null}
      {overlay}
    </SafeAreaView>
  );
}

type ScreenHeaderProps = {
  title: string;
  eyebrow?: string;
  left?: ReactNode;
  right?: ReactNode;
};

export function ScreenHeader({ title, eyebrow, left, right }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {left}
      <View style={styles.headerText}>
        {eyebrow ? (
          <Text variant="eyebrow" tone="secondary">
            {eyebrow}
          </Text>
        ) : null}
        <Text variant="title" tone="strong" accessibilityRole="header">
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.xxl,
    gap: space.lg,
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
  footer: { borderTopWidth: 2, paddingHorizontal: space.lg, paddingVertical: space.md },
  column: { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center', gap: space.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 52 },
  headerText: { flex: 1 },
});
