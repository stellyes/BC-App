import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';

interface EntertainmentMenuProps {
  visible: boolean;
  onClose: () => void;
  searchTags: string;
  onSearchTagsChange: (tags: string) => void;
}

export default function EntertainmentMenu({
  visible,
  onClose,
  searchTags,
  onSearchTagsChange,
}: EntertainmentMenuProps) {
  const router = useRouter();

  const handleAboutPress = () => {
    onClose();
    router.push('/about');
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
          {/* Tag Search Section */}
          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Search Tags</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter tags to search..."
              placeholderTextColor="#666"
              value={searchTags}
              onChangeText={onSearchTagsChange}
            />
          </View>

          <View style={styles.divider} />

          {/* About Button */}
          <TouchableOpacity style={styles.aboutButton} onPress={handleAboutPress}>
            <Text style={styles.aboutButtonText}>About</Text>
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
  searchSection: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#1a1a1a',
    color: '#FCBF27',
  },
  divider: {
    height: 1,
    backgroundColor: '#FCBF27',
    marginVertical: 16,
  },
  aboutButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FCBF27',
    borderRadius: 8,
    alignItems: 'center',
  },
  aboutButtonText: {
    color: '#121212',
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
  },
});
