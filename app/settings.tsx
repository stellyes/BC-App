import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../contexts/NotificationContext';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    preferences,
    updatePreferences,
    permissionStatus,
    requestPermissions,
    expoPushToken
  } = useNotifications();

  // Master toggle state - all notifications on/off
  const [allNotificationsEnabled, setAllNotificationsEnabled] = useState(true);

  // Update master toggle based on individual preferences
  useEffect(() => {
    const allEnabled = preferences.newDeals && preferences.newProducts &&
                       preferences.events && preferences.orderUpdates;
    setAllNotificationsEnabled(allEnabled);
  }, [preferences]);

  const handleMasterToggle = (value: boolean) => {
    setAllNotificationsEnabled(value);
    updatePreferences({
      newDeals: value,
      newProducts: value,
      events: value,
      orderUpdates: value,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FCBF27" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          {permissionStatus !== 'granted' && (
            <TouchableOpacity
              style={styles.enableNotificationsButton}
              onPress={requestPermissions}
            >
              <Ionicons name="notifications-outline" size={20} color="#121212" />
              <Text style={styles.enableNotificationsText}>Enable Notifications</Text>
            </TouchableOpacity>
          )}

          {permissionStatus === 'granted' && (
            <>
              {/* Master Toggle */}
              <View style={styles.masterToggleRow}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.masterToggleLabel}>All Notifications</Text>
                  <Text style={styles.notificationDescription}>
                    Turn all notifications on or off
                  </Text>
                </View>
                <Switch
                  value={allNotificationsEnabled}
                  onValueChange={handleMasterToggle}
                  trackColor={{ false: '#3a3a3a', true: '#FCBF27' }}
                  thumbColor={allNotificationsEnabled ? '#121212' : '#f4f3f4'}
                />
              </View>

              <View style={styles.divider} />

              {/* Individual Notification Toggles */}
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>New Deals</Text>
                  <Text style={styles.notificationDescription}>Get notified about daily deals</Text>
                </View>
                <Switch
                  value={preferences.newDeals}
                  onValueChange={(value) => updatePreferences({ newDeals: value })}
                  trackColor={{ false: '#3a3a3a', true: '#FCBF27' }}
                  thumbColor={preferences.newDeals ? '#121212' : '#f4f3f4'}
                />
              </View>

              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>New Products</Text>
                  <Text style={styles.notificationDescription}>Be the first to know about new items</Text>
                </View>
                <Switch
                  value={preferences.newProducts}
                  onValueChange={(value) => updatePreferences({ newProducts: value })}
                  trackColor={{ false: '#3a3a3a', true: '#FCBF27' }}
                  thumbColor={preferences.newProducts ? '#121212' : '#f4f3f4'}
                />
              </View>

              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>Events</Text>
                  <Text style={styles.notificationDescription}>Updates about upcoming events</Text>
                </View>
                <Switch
                  value={preferences.events}
                  onValueChange={(value) => updatePreferences({ events: value })}
                  trackColor={{ false: '#3a3a3a', true: '#FCBF27' }}
                  thumbColor={preferences.events ? '#121212' : '#f4f3f4'}
                />
              </View>

              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>Order Updates</Text>
                  <Text style={styles.notificationDescription}>Status updates for your orders</Text>
                </View>
                <Switch
                  value={preferences.orderUpdates}
                  onValueChange={(value) => updatePreferences({ orderUpdates: value })}
                  trackColor={{ false: '#3a3a3a', true: '#FCBF27' }}
                  thumbColor={preferences.orderUpdates ? '#121212' : '#f4f3f4'}
                />
              </View>

              {expoPushToken && (
                <View style={styles.tokenInfo}>
                  <Text style={styles.tokenLabel}>Push Token (for development):</Text>
                  <Text style={styles.tokenValue} numberOfLines={2}>{expoPushToken}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FCBF27',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 16,
  },
  enableNotificationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCBF27',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  enableNotificationsText: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  masterToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  masterToggleLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 4,
  },
  divider: {
    height: 2,
    backgroundColor: '#FCBF27',
    marginVertical: 16,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.6,
  },
  tokenInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  tokenLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tokenValue: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.5,
  },
});
