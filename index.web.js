import '@expo/metro-runtime';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

// CanvasKit has to exist before any Skia module runs, so the app is required only once it has loaded.
LoadSkiaWeb({ locateFile: (file) => `/${file}` }).then(() => {
  require('expo-router/entry-classic');
});
