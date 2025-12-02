import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

/**
 * WELCOME TO YOUR FIRST APP!
 * 
 * This is a simple counter and greeting app that demonstrates:
 * - Components (building blocks of your UI)
 * - State (data that can change)
 * - Props (passing data to components)
 * - Event handling (responding to user actions)
 */

export default function App() {
  // STATE: These are values that can change in your app
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>My First App! 🎉</Text>
      
      {/* Greeting Section */}
      <View style={styles.section}>
        <Text style={styles.label}>What's your name?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        {name ? (
          <Text style={styles.greeting}>Hello, {name}! 👋</Text>
        ) : null}
      </View>

      {/* Counter Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Tap Counter</Text>
        <Text style={styles.counter}>{count}</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.decrementButton]}
            onPress={() => setCount(count - 1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]}
            onPress={() => setCount(0)}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.incrementButton]}
            onPress={() => setCount(count + 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fun Message */}
      <Text style={styles.footer}>
        Keep learning! You're doing great! 🚀
      </Text>
    </View>
  );
}

// STYLES: Make your app look good!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  section: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  greeting: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
  counter: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  incrementButton: {
    backgroundColor: '#4CAF50',
  },
  decrementButton: {
    backgroundColor: '#f44336',
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});