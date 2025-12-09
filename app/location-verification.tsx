import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useLocation } from '../contexts/LocationContext';

export default function LocationVerificationScreen() {
  const router = useRouter();
  const { verifyLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationRequest = async () => {
    setIsLoading(true);

    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to verify that you are in California. Please enable location services in your device settings.',
          [{ text: 'OK', onPress: () => setIsLoading(false) }]
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Check if user is in California
      const isInCA = address.region === 'California' || address.region === 'CA';

      verifyLocation(isInCA);

      if (isInCA) {
        router.replace('/age-verification');
      } else {
        // User is not in California - show the error state (handled by navigation logic)
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to verify your location. Please ensure location services are enabled and try again.',
        [{ text: 'OK', onPress: () => setIsLoading(false) }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/header-image.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Location Verification Required</Text>

      <Text style={styles.subtitle}>
        We need to verify that you are located in California to provide our services.
      </Text>

      <Text style={styles.infoText}>
        Your location data will only be used to confirm your eligibility and will not be stored or shared.
      </Text>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLocationRequest}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#121212" />
        ) : (
          <Text style={styles.buttonText}>Share My Location</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        By sharing your location, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 280,
    height: 84,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 20,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: 'Poppins-Light',
    color: '#FCBF27',
    textAlign: 'center',
    opacity: 0.7,
  },
});
