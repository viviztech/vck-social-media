import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.vck.socialmedia',
    appName: 'VCK Social Media',
    webDir: 'out',
    server: {
        // Use this for development with live reload
        // url: 'http://192.168.1.2:3500',
        // cleartext: true,
        androidScheme: 'https',
    },
    plugins: {
        StatusBar: {
            style: 'DARK',
            backgroundColor: '#1a237e',
        },
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: '#1a237e',
            showSpinner: true,
            spinnerColor: '#ffffff',
            androidScaleType: 'CENTER_CROP',
        },
    },
    android: {
        buildOptions: {
            keystorePath: undefined,
            keystoreAlias: undefined,
        },
    },
    ios: {
        scheme: 'VCK Social Media',
    },
};

export default config;
