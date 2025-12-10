import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '@/contexts/CartContext';
import { UserProvider } from '@/contexts/UserContext';
import { AgeVerificationProvider, useAgeVerification } from '@/contexts/AgeVerificationContext';
import { LocationProvider, useLocation } from '@/contexts/LocationContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { OrderProvider } from '@/contexts/OrderContext';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isLocationVerified, isInCalifornia } = useLocation();
  const { isAgeVerified } = useAgeVerification();

  useEffect(() => {
    const inLocationVerification = segments[0] === 'location-verification';
    const inLocationRestricted = segments[0] === 'location-restricted';
    const inAgeVerification = segments[0] === 'age-verification';
    const inTabs = segments[0] === '(tabs)';
    const inDealDetail = segments[0] === 'deal-detail';
    const inProductDetail = segments[0] === 'product-detail';
    const inCart = segments[0] === 'cart';
    const inAbout = segments[0] === 'about';
    const inMyInfo = segments[0] === 'my-info';
    const inSettings = segments[0] === 'settings';
    const inPastPurchases = segments[0] === 'past-purchases';

    // Step 1: Check location verification
    if (!isLocationVerified && !inLocationVerification) {
      router.replace('/location-verification');
      return;
    }

    // Step 2: If location verified but not in California, show restriction screen
    if (isLocationVerified && isInCalifornia === false && !inLocationRestricted) {
      router.replace('/location-restricted');
      return;
    }

    // Step 3: If in California but not age verified, show age verification
    if (isLocationVerified && isInCalifornia === true && !isAgeVerified && !inAgeVerification) {
      router.replace('/age-verification');
      return;
    }

    // Step 4: If all verifications passed, redirect to tabs (unless on deal detail or other allowed pages)
    if (isLocationVerified && isInCalifornia === true && isAgeVerified && !inTabs && !inDealDetail && !inProductDetail && !inCart && !inAbout && !inMyInfo && !inSettings && !inPastPurchases) {
      router.replace('/(tabs)');
      return;
    }
  }, [isLocationVerified, isInCalifornia, isAgeVerified, segments]);

  return (
    <Stack>
      <Stack.Screen name="location-verification" options={{ headerShown: false }} />
      <Stack.Screen name="location-restricted" options={{ headerShown: false }} />
      <Stack.Screen name="age-verification" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="deal-detail" options={{ headerShown: false }} />
      <Stack.Screen name="product-detail" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="my-info" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="past-purchases" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

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
    <LocationProvider>
      <AgeVerificationProvider>
        <UserProvider>
          <NotificationProvider>
            <OrderProvider>
              <CartProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  <RootLayoutNav />
                  <StatusBar style="auto" />
                </ThemeProvider>
              </CartProvider>
            </OrderProvider>
          </NotificationProvider>
        </UserProvider>
      </AgeVerificationProvider>
    </LocationProvider>
  );
}
