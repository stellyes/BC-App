import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { useAgeVerification } from '../contexts/AgeVerificationContext';

export default function AgeVerificationScreen() {
  const router = useRouter();
  const { verifyAge } = useAgeVerification();

  const handleAgeConfirm = () => {
    verifyAge();
    router.replace('/(tabs)');
  };

  const handleAgeDeny = () => {
    Alert.alert(
      'Age Requirement Not Met',
      'You must be 21+ or 18+ with a valid State Issued Medical ID to use this app. The app will now close.',
      [
        {
          text: 'OK',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/header-image.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Age Verification Required</Text>

      <Text style={styles.subtitle}>
        You must be 21 years or older, or 18 years or older with a valid State Issued Medical ID to enter.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleAgeConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>I am 21+ or 18+ with MMID</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.denyButton}
          onPress={handleAgeDeny}
          activeOpacity={0.8}
        >
          <Text style={styles.denyButtonText}>I am not 21+ or 18+ with MMID</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        By entering this site, you are agreeing to our Terms of Service and Privacy Policy.
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
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  denyButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  denyButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: 'Poppins-Light',
    color: '#FCBF27',
    textAlign: 'center',
    opacity: 0.7,
  },
});
