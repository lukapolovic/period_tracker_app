import { router } from 'expo-router';

/** Back if there's somewhere to go back to (deep links may open a screen directly), else home. */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
