module.exports = function (api) {
  const isNative = api.caller(
    (caller) =>
      caller && (caller.platform === 'ios' || caller.platform === 'android'),
  );
  const config = {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@app': './src/app',
            '@api': './src/api',
            '@assets': './src/assets',
            '@constants': './src/constants',
            '@hooks': './src/hooks',
            '@queries': './src/queries',
            '@utils': './src/utils',
            '@atoms': './src/components/atoms',
            '@molecules': './src/components/molecules',
            '@organisms': './src/components/organisms',
            '@templates': './src/components/templates',
            '@contexts': './src/contexts',
            '@hoc/*': 'hoc/*',
          },
        },
      ],
      'add-react-displayname',
    ],
  };
  if (isNative) {
    config.plugins.push(
      '../../node_modules/@heap/react-native-heap/instrumentor/src/index.js',
    );
  }

  return config;
};
