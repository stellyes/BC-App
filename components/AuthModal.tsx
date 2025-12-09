import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../contexts/UserContext';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

type ViewMode = 'choice' | 'login' | 'signup';

export default function AuthModal({ visible, onClose }: AuthModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('choice');
  const { login } = useUser();

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [idImage, setIdImage] = useState<string | null>(null);

  const handleLogin = () => {
    // For now, just login with dummy data
    login();
    onClose();
    resetForm();
  };

  const handleSignup = () => {
    // Validate all fields are filled
    if (!firstName || !lastName || !birthday || !idImage) {
      Alert.alert('Missing Information', 'Please fill in all fields and upload your ID.');
      return;
    }

    // For now, just login with dummy data (will be replaced with API call)
    login();
    onClose();
    resetForm();
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setIdImage(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setViewMode('choice');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setBirthday('');
    setIdImage(null);
  };

  const renderChoiceView = () => (
    <>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in or create an account to get started</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => setViewMode('login')}>
        <Text style={styles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => setViewMode('signup')}>
        <Text style={styles.secondaryButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </>
  );

  const renderLoginView = () => (
    <>
      <TouchableOpacity style={styles.backButton} onPress={() => setViewMode('choice')}>
        <Ionicons name="arrow-back" size={24} color="#FCBF27" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to access your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
        <Text style={styles.authButtonText}>Log In</Text>
      </TouchableOpacity>
    </>
  );

  const renderSignupView = () => (
    <>
      <TouchableOpacity style={styles.backButton} onPress={() => setViewMode('choice')}>
        <Ionicons name="arrow-back" size={24} color="#FCBF27" />
      </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to view our menu and exclusive deals</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#999"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#999"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Birthday (MM/DD/YYYY)"
        placeholderTextColor="#999"
        value={birthday}
        onChangeText={setBirthday}
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.uploadLabel}>Government-Issued ID</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Ionicons name="cloud-upload-outline" size={32} color="#FCBF27" />
        <Text style={styles.uploadButtonText}>
          {idImage ? 'ID Uploaded ✓' : 'Upload ID Photo'}
        </Text>
      </TouchableOpacity>

      {idImage && (
        <Image source={{ uri: idImage }} style={styles.previewImage} />
      )}

      <TouchableOpacity style={styles.authButton} onPress={handleSignup}>
        <Text style={styles.authButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#FCBF27" />
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {viewMode === 'choice' && renderChoiceView()}
            {viewMode === 'login' && renderLoginView()}
            {viewMode === 'signup' && renderSignupView()}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: '50%',
    maxHeight: '90%',
    borderTopWidth: 2,
    borderTopColor: '#FCBF27',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 8,
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  primaryButton: {
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FCBF27',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  input: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: '#121212',
    borderWidth: 2,
    borderColor: '#FCBF27',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  authButton: {
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  authButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
});
