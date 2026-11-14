const isDev = process.env.APP_ENV === "development";

export default {
  expo: {
    name: isDev ? "ProdutividadeMax DEV" : "ProdutividadeMax",
    slug: "produtividadeMax-app",
    version: "1.0.0",
    orientation: "portrait",

    icon: "./assets/icon.png",

    scheme: isDev ? "produtividademaxapp-dev" : "produtividademaxapp",

    userInterfaceStyle: "automatic",

    android: {
      permissions: ["android.permission.SCHEDULE_EXACT_ALARM"],

      package: isDev
        ? "com.maxsuel.produtividademaxapp.dev"
        : "com.maxsuel.produtividademaxapp",
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
      bundler: "metro",
    },

    plugins: [
      "expo-router",

      [
        "expo-splash-screen",
        {
          backgroundColor: "#03132B",
          image: "./assets/splash.png",
          imageWidth: 350,
          resizeMode: "contain",
        },
      ],

      "expo-sqlite",

      [
        "expo-notifications",
        {
          sounds: ["./assets/sounds/alert_notification.wav"],
        },
      ],

      "expo-background-task",

      "expo-sharing",

      [
        "expo-build-properties",
        {
          android: {
            buildArchs: ["arm64-v8a"],
          },
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      router: {},

      eas: {
        projectId: "e6151eb2-a167-474f-81c8-de8a2bf97d7a",
      },
    },

    owner: "maxsuelf94",
  },
};
