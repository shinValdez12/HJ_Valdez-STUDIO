import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mcdonalds.timetracker',
  appName: "CrewTime",
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    allowsInlineMediaPlayback: true,
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#FFFFFF',
      androidScaleType: 'CENTER_CROP',
      spinnerColor: '#DA291C',
      showSpinner: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
