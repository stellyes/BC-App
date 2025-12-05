import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const router = useRouter();

  const handleWebsitePress = () => {
    Linking.openURL('https://barbarycoastsf.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#FCBF27" />
        </TouchableOpacity>
        <Text style={styles.title}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <Image
          source={require('../assets/images/header-image.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />

        {/* Main Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>San Francisco's Premier Cannabis Lounge</Text>
          <Text style={styles.bodyText}>
            Barbary Coast is San Francisco's oldest cannabis lounge and a pioneering fixture in the city's cannabis culture. For over a decade, this leading cannabis lounge in San Francisco has served as a premier destination, offering both a carefully curated selection of premium products and a welcoming social space where enthusiasts can gather and consume on-site.
          </Text>
          <Text style={styles.bodyText}>
            As a trailblazer in the industry, Barbary Coast has established itself as more than just a dispensary—it's a community hub that has helped shape the city's cannabis scene and set the standard for elevated, sophisticated cannabis experiences.
          </Text>
        </View>

        {/* About Images */}
        <Image
          source={require('../assets/about/about-1.jpg')}
          style={styles.aboutImage}
          resizeMode="cover"
        />

        {/* Convenience Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conveniently Located</Text>
          <Text style={styles.bodyText}>
            Are you on your way to catch a flight at SFO? Or are you wanting to smoke a joint before your big event at the Chase Center? Here, at San Francisco's Barbary Coast, you are able to smoke your weed however you prefer and still make it to your plans on time!
          </Text>
          <Text style={styles.bodyText}>
            We are a premier cannabis dispensary located in the heart of San Francisco, and we can't wait to see you!
          </Text>
        </View>

        <Image
          source={require('../assets/about/about-2.jpg')}
          style={styles.aboutImage}
          resizeMode="cover"
        />

        {/* Events Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unforgettable Live Events</Text>
          <Text style={styles.bodyText}>
            Join us for unforgettable live events! From live music and comedy shows to movie nights, trivia competitions, and Football Sundays, there's always something happening at our lounge.
          </Text>
          <Text style={styles.bodyText}>
            Check our event calendar and experience the best cannabis-friendly entertainment in San Francisco!
          </Text>
        </View>

        <Image
          source={require('../assets/about/about-3.jpg')}
          style={styles.aboutImage}
          resizeMode="cover"
        />

        {/* Grass Roots Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grass Roots Delivery</Text>
          <Text style={styles.bodyText}>
            Grass Roots, our sister location, has been a Bay Area institution since 2005. As San Francisco's original cannabis club, they've perfected the art of fast, free delivery on orders $50 and up.
          </Text>
          <Text style={styles.bodyText}>
            Available every day from 1:00 PM – 8:00 PM, thousands of customers count on Grass Roots for reliable, premium cannabis delivery.
          </Text>
        </View>

        <Image
          source={require('../assets/about/about-4.jpg')}
          style={styles.aboutImage}
          resizeMode="cover"
        />

        {/* Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wide Selection of Premium Products</Text>
          <Text style={styles.bodyText}>
            Start shopping our wide selection of products now! We carry everything you need for your perfect cannabis experience—premium flower in a variety of strains, delicious edibles, fast-acting tinctures, soothing topicals, and so much more.
          </Text>
          <Text style={styles.bodyText}>
            Whether you're looking for relaxation, relief, or recreation, our diverse inventory has something for everyone. Our knowledgeable staff is here to help you find exactly what you're looking for!
          </Text>
        </View>

        {/* Divider */}
        <Image
          source={require('../assets/images/divider.png')}
          style={styles.divider}
        />

        {/* Website Button */}
        <TouchableOpacity
          style={styles.websiteButton}
          onPress={handleWebsitePress}
          activeOpacity={0.8}
        >
          <Ionicons name="globe-outline" size={24} color="#121212" />
          <Text style={styles.websiteButtonText}>Visit our Website</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FCBF27',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 120,
    marginTop: 20,
    marginBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 16,
    lineHeight: 30,
  },
  bodyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    lineHeight: 26,
    marginBottom: 16,
  },
  aboutImage: {
    width: '100%',
    height: 250,
    marginBottom: 24,
  },
  divider: {
    width: '90%',
    height: 15,
    alignSelf: 'center',
    marginVertical: 24,
  },
  websiteButton: {
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    gap: 12,
  },
  websiteButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  bottomSpacing: {
    height: 40,
  },
});
