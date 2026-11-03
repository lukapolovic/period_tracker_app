import { Nunito_900Black } from '@expo-google-fonts/nunito';
import {
  NunitoSans_500Medium,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from '@expo-google-fonts/nunito-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useAppStore, useHasHydrated } from '@/store/app-store';
import { AppThemeProvider, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Fonts ship inside the app bundle — no font CDN, no network calls.
  const [fontsLoaded, fontError] = useFonts({
    Nunito_900Black,
    NunitoSans_500Medium,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });
  const hydrated = useHasHydrated();
  const ready = (fontsLoaded || !!fontError) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <AppThemeProvider>
      <Navigator />
    </AppThemeProvider>
  );
}

function Navigator() {
  const { scheme, colors } = useTheme();
  const onboarded = useAppStore((s) => s.settings.onboarded);
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.canvas,
      card: colors.surface,
      text: colors.text,
      border: colors.line,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
        {/* Flipping `onboarded` (finishing setup, or deleting all data) redirects automatically. */}
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="day/[date]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings" />
          <Stack.Screen name="how-it-works" />
        </Stack.Protected>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false, animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
