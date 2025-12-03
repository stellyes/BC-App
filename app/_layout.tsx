import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '@/contexts/CartContext';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    'Adamina-Regular': require('../assets/webfonts/Adamina-Regular.ttf'),
    'Poppins-Bold': require('../assets/webfonts/Poppins-Bold.ttf'),
    'Poppins-BoldItalic': require('../assets/webfonts/Poppins-BoldItalic.ttf'),
    'Poppins-Regular': require('../assets/webfonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/webfonts/Poppins-Medium.ttf'),
    'Poppins-MediumItalic': require('../assets/webfonts/Poppins-MediumItalic.ttf'),
    'Poppins-Light': require('../assets/webfonts/Poppins-Light.ttf'),
    'Poppins-LightItalic': require('../assets/webfonts/Poppins-LightItalic.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <CartProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CartProvider>
  );
}
