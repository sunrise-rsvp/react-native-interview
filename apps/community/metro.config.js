// Learn more https://docs.expo.io/guides/customizing-metro
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// Generate base configuration
const config = getSentryExpoConfig(__dirname);

// To get platform specific modules to work
config.resolver.sourceExts.push('mjs', 'web.tsx', 'native.tsx');

module.exports = config;
