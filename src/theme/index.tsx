import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ColorTokens } from './tokens';

export * from './tokens';

export type ThemePreference = 'system' | 'light' | 'dark';

export type Theme = { scheme: 'light' | 'dark'; colors: ColorTokens };

const lightTheme: Theme = { scheme: 'light', colors: lightColors };
const darkTheme: Theme = { scheme: 'dark', colors: darkColors };

const ThemeContext = createContext<Theme>(lightTheme);

/** Takes the preference as a prop, so the theme never reaches into the store and components render without it. */
export function AppThemeProvider({ preference, children }: { preference: ThemePreference; children: ReactNode }) {
  const system = useColorScheme();
  const scheme = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
  return (
    <ThemeContext.Provider value={scheme === 'dark' ? darkTheme : lightTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/** Builds a style sheet from the current theme. Keep `factory` at module scope. */
export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
