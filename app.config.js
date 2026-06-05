import 'dotenv/config';

export default {
  expo: {
    name: "Presency",
    slug: "presency-app",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "presency",
    userInterfaceStyle: "dark",
    backgroundColor: "#080808",
    splash: {
      backgroundColor: "#080808"
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.axiscreative.presency",
      infoPlist: {
        UIStatusBarStyle: "UIStatusBarStyleLightContent"
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#080808"
      },
      package: "com.axiscreative.presency",
      statusBar: {
        backgroundColor: "#080808",
        barStyle: "light-content"
      }
    },
    plugins: [
      "expo-router",
      "expo-font"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      supabaseUrl: "https://mhtqvuglujodpffpmmhe.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHF2dWdsdWpvZHBmZnBtbWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyOTg0NzAsImV4cCI6MjA5NTg3NDQ3MH0.01DA51ogwf1lHlkl_0cjoRzZZRquCoHEB2mlttoXeRk"
    }
  }
};
