import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';

/**
 * WELCOME TO YOUR FIRST APP!
 * 
 * This is a simple counter and greeting app that demonstrates:
 * - Components (building blocks of your UI)
 * - State (data that can change)
 * - Props (passing data to components)
 * - Event handling (responding to user actions)
 */

const { width: windowWidth } = Dimensions.get('window');

function BannerCarousel() {
  const banners = [
    require('../../assets/mobilebanners/jettymobilebanner.png'),
    require('../../assets/mobilebanners/britemobilebanner.png'),
    require('../../assets/mobilebanners/KINDmobilebanner.png'),
    require('../../assets/mobilebanners/FFFmobilebanner.png'),
    require('../../assets/mobilebanners/ICEDmobilebanner.png'),
  ];

  const scrollRef = useRef(null as ScrollView | null);
  const currentIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerWidth = windowWidth - 40; // account for container padding

  useEffect(() => {
    const id = setInterval(() => {
      const next = (currentIndexRef.current + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: next * bannerWidth, animated: true });
      currentIndexRef.current = next;
      setCurrentIndex(next);
    }, 4000);

    return () => clearInterval(id);
  }, [bannerWidth]);

  function onMomentumScrollEnd(e: any) {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / bannerWidth);
    currentIndexRef.current = idx;
    setCurrentIndex(idx);
  }

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {banners.map((src, i) => (
          <View key={i} style={{ width: bannerWidth, alignItems: 'center' }}>
            <Image source={src} style={styles.bannerImage} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {banners.map((_, i) => (
          <View key={i} style={[styles.dot, currentIndex === i && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

export default function App() {
  // STATE: These are values that can change in your app
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <Image source={require('../../assets/images/header-image.png')} style={styles.headerImage} />
      <BannerCarousel />

      {/* Greeting Section */}
      <View style={styles.section}>
        <Text style={styles.label}>What's your favorite strain?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your favorite strain"
          value={name}
          onChangeText={setName}
        />
        {name ? (
          <Text style={styles.greeting}>fr? {name}?? ...alright freak 👋</Text>
        ) : null}
      </View>

      {/* Counter Section */}
      <View style={styles.section}>
        <Text style={styles.label}>How many times did you smoke today?</Text>
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
    backgroundColor: '#2c2c2c',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  headerImage: {
    width: 280,
    height: 84,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bbb',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#333',
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
    borderColor: '#aaa',
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