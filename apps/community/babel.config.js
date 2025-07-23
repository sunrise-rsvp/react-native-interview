module.exports = function (api) {
  api.cache(true);
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

  return config;
};
