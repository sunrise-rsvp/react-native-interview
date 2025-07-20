// This must be the first import for hot reloading to work
import 'expo-router/entry';
// animation package 'moti' requires we import these like this
import { Platform } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

// Conditionally import registerGlobals and call it only on native
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
  const { registerGlobals } = require('@livekit/react-native');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  registerGlobals();
}
