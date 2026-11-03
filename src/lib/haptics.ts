import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Light tap when something is logged (MARKET_ANALYSIS.md §13.2). */
export function tapFeedback() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
