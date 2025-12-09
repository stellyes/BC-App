import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import AuthModal from '../../components/AuthModal';

export default function ProfileScreen() {
  const { isLoggedIn, userData, logout } = useUser();
  const router = useRouter();
  const [authModalVisible, setAuthModalVisible] = useState(false);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Ionicons name="person-circle-outline" size={120} color="#FCBF27" />
          <Text style={styles.loginTitle}>Welcome to The Barbary Coast</Text>
          <Text style={styles.loginSubtitle}>Sign in to access your profile and rewards</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => setAuthModalVisible(true)}
          >
            <Text style={styles.loginButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        <AuthModal visible={authModalVisible} onClose={() => setAuthModalVisible(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture and Name */}
        <View style={styles.profileHeader}>
          <View style={styles.profilePictureContainer}>
            <Ionicons name="person-circle" size={120} color="#FCBF27" />
          </View>
          <Text style={styles.fullName}>
            {userData?.firstName} {userData?.lastName}
          </Text>
        </View>

        {/* Rewards and Past Purchases */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionLabel}>Rewards</Text>
            <Text style={styles.actionValue}>${userData?.rewardsBalance.toFixed(2)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionLabel}>Past Purchases</Text>
            <Ionicons name="receipt-outline" size={24} color="#FCBF27" style={styles.actionIcon} />
          </TouchableOpacity>
        </View>

        {/* Discount Codes */}
        <TouchableOpacity
          style={styles.discountButton}
          onPress={() => router.push('/discount-codes')}
        >
          <Ionicons name="pricetag-outline" size={20} color="#121212" />
          <Text style={styles.discountButtonText}>Discount Codes</Text>
        </TouchableOpacity>

        {/* User Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {userData?.nickname && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nickname</Text>
              <Text style={styles.infoValue}>{userData.nickname}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{userData?.dateOfBirth}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver's License</Text>
            <Text style={styles.infoValue}>{userData?.driversLicense}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID Expiry Date</Text>
            <Text style={styles.infoValue}>{userData?.idExpiryDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{userData?.gender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{userData?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{userData?.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{userData?.address}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#121212" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.8,
    marginBottom: 32,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#FCBF27',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePictureContainer: {
    marginBottom: 16,
  },
  fullName: {
    fontSize: 24,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 8,
  },
  actionValue: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  actionIcon: {
    marginTop: 4,
  },
  discountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  discountButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  infoSection: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.7,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
});
