import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';

interface ProfileMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileMenu({
  visible,
  onClose,
}: ProfileMenuProps) {
  const router = useRouter();
  const { logout } = useUser();

  const handleMyInfoPress = () => {
    onClose();
    router.push('/my-info');
  };

  const handleSettingsPress = () => {
    onClose();
    router.push('/settings');
  };

  const handleLogoutPress = () => {
    onClose();
    logout();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuContainer} onStartShouldSetResponder={() => true}>
          {/* My Info Button */}
          <TouchableOpacity style={styles.menuButton} onPress={handleMyInfoPress}>
            <Ionicons name="person-outline" size={20} color="#121212" />
            <Text style={styles.menuButtonText}>My Info</Text>
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity style={styles.menuButton} onPress={handleSettingsPress}>
            <Ionicons name="settings-outline" size={20} color="#121212" />
            <Text style={styles.menuButtonText}>Settings</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Log Out Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            <Ionicons name="log-out-outline" size={20} color="#FCBF27" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '50%',
    height: '100%',
    backgroundColor: '#121212',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FCBF27',
    borderRadius: 8,
    marginBottom: 12,
  },
  menuButtonText: {
    color: '#121212',
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#FCBF27',
    marginVertical: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#121212',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FCBF27',
  },
  logoutButtonText: {
    color: '#FCBF27',
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
  },
});
