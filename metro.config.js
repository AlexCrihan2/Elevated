const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable Reanimated 3 support
config.transformer.unstable_allowRequireContext = true;

// Support for .tsx and .ts files
config.resolver.sourceExts = [...config.resolver.sourceExts, 'tsx', 'ts'];

module.exports = config;