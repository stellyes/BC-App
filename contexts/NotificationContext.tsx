import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationPreferences {
  newDeals: boolean;
  newProducts: boolean;
  events: boolean;
  orderUpdates: boolean;
}

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  preferences: NotificationPreferences;
  permissionStatus: Notifications.PermissionStatus | null;
  requestPermissions: () => Promise<boolean>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_PREFS_KEY = '@notification_preferences';
const PUSH_TOKEN_KEY = '@expo_push_token';

const defaultPreferences: NotificationPreferences = {
  newDeals: true,
  newProducts: true,
  events: true,
  orderUpdates: true,
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Load saved preferences and push token
    loadPreferences();
    loadPushToken();
    checkPermissionStatus();

    // Register for push notifications
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        savePushToken(token);
      }
    });

    // Listener for notifications received while app is open
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener for when user taps on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User tapped notification:', response);
      // You can add navigation logic here based on notification data
      const data = response.notification.request.content.data;
      if (data?.screen) {
        // Navigate to specific screen based on data.screen
        console.log('Navigate to:', data.screen);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const checkPermissionStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const loadPushToken = async () => {
    try {
      const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (token) {
        setExpoPushToken(token);
      }
    } catch (error) {
      console.error('Error loading push token:', error);
    }
  };

  const savePushToken = async (token: string) => {
    try {
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
      // In production, you would send this token to your backend server
      console.log('Push token saved:', token);
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        // Register for push notifications after permission is granted
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
          savePushToken(token);
        }
        return true;
      } else {
        Alert.alert(
          'Notifications Disabled',
          'Please enable notifications in your device settings to receive updates about deals and products.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const updatePreferences = async (prefs: Partial<NotificationPreferences>) => {
    try {
      const newPrefs = { ...preferences, ...prefs };
      setPreferences(newPrefs);
      await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  const sendLocalNotification = async (title: string, body: string, data?: any) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: null, // null means send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        preferences,
        permissionStatus,
        requestPermissions,
        updatePreferences,
        sendLocalNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper function to register for push notifications
async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FCBF27',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    try {
      // Try to get projectId from Constants
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      if (projectId) {
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      } else {
        // Fallback: try without projectId (works if published to Expo)
        token = (await Notifications.getExpoPushTokenAsync()).data;
      }
      console.log('Expo Push Token:', token);
    } catch (error) {
      console.error('Error getting push token:', error);
      console.log('Note: Push notifications require the app to be published to Expo or have a valid EAS projectId');
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}
