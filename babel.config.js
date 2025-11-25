// babel.config.js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel", // ✅ v4: use as preset
    ],
    plugins: [
      // add other plugins here if you use them, e.g.:
      // "react-native-reanimated/plugin",
      // "expo-router/babel",
    ],
  };
};
