import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function LocationRestrictedScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/header-image.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>We're Sorry</Text>

      <Text style={styles.message}>
        Our services are currently only available to customers located in California.
      </Text>

      <Text style={styles.subMessage}>
        We appreciate your interest and hope to expand to your area in the future.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Currently Serving:</Text>
        <Text style={styles.infoText}>California, USA</Text>
      </View>

      <Text style={styles.footerText}>
        Thank you for your understanding.
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
    fontSize: 32,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  subMessage: {
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
    opacity: 0.8,
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    color: '#FCBF27',
    textAlign: 'center',
    opacity: 0.7,
  },
});
