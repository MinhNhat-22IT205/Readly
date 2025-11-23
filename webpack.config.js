const { withExpo } = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const config = withExpo(env, argv);

  // Shim import.meta.env so ESM deps won't crash on web
  config.plugins = config.plugins || [];
  config.plugins.push(
    new webpack.DefinePlugin({
      'import.meta.env': JSON.stringify({}),
    })
  );

  return config;
};


