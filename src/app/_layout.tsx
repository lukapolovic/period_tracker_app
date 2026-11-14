import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FlowProvider } from '@/flow/flow-provider';
import { useReminderSync } from '@/hooks/use-reminders';
import { useAppStore, useHasHydrated } from '@/store/app-store';
import { AppThemeProvider, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Fonts ship inside the app bundle — no font CDN, no network calls.
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium });
  const hydrated = useHasHydrated();
  const theme = useAppStore((s) => s.settings.theme);
  const ready = (fontsLoaded || !!fontError) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <ReminderSync />
      <AppThemeProvider preference={theme}>
        <FlowProvider>
          <Navigator />
        </FlowProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

/** On its own so a new prediction doesn't re-render the navigator. */
function ReminderSync() {
  useReminderSync();
  return null;
}

/** Sheets are routes, but they rise over the one page instead of replacing it. */
const SHEET = { presentation: 'transparentModal', animation: 'none', contentStyle: { backgroundColor: 'transparent' } } as const;

function Navigator() {
  const { scheme, colors } = useTheme();
  const onboarded = useAppStore((s) => s.settings.onboarded);
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.structure,
      background: colors.canvas,
      card: colors.surface,
      text: colors.ink,
      border: colors.line,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
        {/* Flipping `onboarded` (finishing setup, or deleting all data) redirects automatically. */}
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="index" />
          <Stack.Screen name="day/[date]" options={SHEET} />
          <Stack.Screen name="how-it-works" options={SHEET} />
        </Stack.Protected>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false, animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
