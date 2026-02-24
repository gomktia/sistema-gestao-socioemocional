import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.triavium.app',
  appName: 'Triavium',
  webDir: 'out',
  server: {
    url: 'https://triavium.com.br',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#0d9488',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#0d9488',
    },
  },
};

export default config;
