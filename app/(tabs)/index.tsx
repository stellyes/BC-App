import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import eventsData from '../../data/dummy-events.json';
import { useUser } from '../../contexts/UserContext';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrderContext';
import dummyProductsData from '../../data/dummy-products.json';
import AuthModal from '../../components/AuthModal';
import OrderTracker from '../../components/OrderTracker';

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

const EVENT_IMAGES: { [key: string]: any } = {
  dummy_event_1: require('../../assets/events/dummy_event_1.jpg'),
  dummy_event_2: require('../../assets/events/dummy_event_2.jpg'),
  dummy_event_3: require('../../assets/events/dummy_event_3.jpg'),
  dummy_event_4: require('../../assets/events/dummy_event_4.jpg'),
  dummy_event_5: require('../../assets/events/dummy_event_5.jpg'),
  dummy_event_6: require('../../assets/events/dummy_event_6.jpg'),
  dummy_event_7: require('../../assets/events/dummy_event_7.jpg'),
  dummy_event_8: require('../../assets/events/dummy_event_8.jpg'),
  dummy_event_9: require('../../assets/events/dummy_event_9.jpg'),
  dummy_event_10: require('../../assets/events/dummy_event_10.jpg'),
  dummy_event_11: require('../../assets/events/dummy_event_11.jpg'),
  dummy_event_12: require('../../assets/events/dummy_event_12.jpg'),
};

interface Event {
  id: string;
  title: string;
  photo: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  tags: string;
}

function BannerCarousel() {
  const router = useRouter();

  const banners = [
    { id: '1', source: require('../../assets/mobilebanners/jettymobilebanner.png') },
    { id: '2', source: require('../../assets/mobilebanners/britemobilebanner.png') },
    { id: '3', source: require('../../assets/mobilebanners/KINDmobilebanner.png') },
    { id: '4', source: require('../../assets/mobilebanners/FFFmobilebanner.png') },
    { id: '5', source: require('../../assets/mobilebanners/ICEDmobilebanner.png') },
  ];

  // For infinite scroll, duplicate first and last
  const items = [banners[banners.length - 1], ...banners, banners[0]];
  const scrollRef = useRef<ScrollView | null>(null);
  const currentIndexRef = useRef(1); // start at the first real item (items[1])
  const currentXRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0); // user-facing index (0..banners.length-1)
  const bannerWidth = windowWidth - 40; // account for container padding

  // autoplay settings
  const AUTO_DELAY = 7000; // ms between auto scrolls (slower)
  const ANIM_DURATION = 900; // ms for the scroll animation (slower)

  // refs to manage autoplay and pause timeout
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // on mount, position to the first real item
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: bannerWidth, animated: false });
      currentXRef.current = bannerWidth;
    }, 50);

    startAutoPlay();

    return () => {
      stopAutoPlay();
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerWidth]);

  function startAutoPlay() {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      autoAdvance();
    }, AUTO_DELAY);
  }

  function stopAutoPlay() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function pauseAutoplayFor(ms: number) {
    // clear any existing pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    stopAutoPlay();
    pauseTimeoutRef.current = setTimeout(() => {
      startAutoPlay();
      pauseTimeoutRef.current = null;
    }, ms);
  }

  // helper to perform a smooth scroll with controllable duration
  function animateScrollTo(targetX: number, duration = ANIM_DURATION) {
    const startX = currentXRef.current || 0;
    const delta = targetX - startX;
    if (delta === 0) return;
    const start = Date.now();

    function step() {
      const now = Date.now();
      const t = Math.min(1, (now - start) / duration);
      // easeInOutQuad
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const x = startX + delta * eased;
      scrollRef.current?.scrollTo({ x, animated: false });
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        currentXRef.current = targetX;
      }
    }

    requestAnimationFrame(step);
  }

  function autoAdvance() {
    const next = currentIndexRef.current + 1;
    const target = next * bannerWidth;
    animateScrollTo(target, ANIM_DURATION);
    currentIndexRef.current = next;
    // update user-facing index after animation completes (approx)
    setTimeout(() => {
      syncIndexAfterScroll();
    }, ANIM_DURATION + 50);
  }

  function syncIndexAfterScroll() {
    // compute logical index within items
    let idx = Math.round(currentXRef.current / bannerWidth);
    // handle clones
    if (idx === 0) {
      // jumped to clone of last -> go to real last
      const realIdx = banners.length;
      scrollRef.current?.scrollTo({ x: realIdx * bannerWidth, animated: false });
      currentIndexRef.current = realIdx;
      currentXRef.current = realIdx * bannerWidth;
      setCurrentIndex(realIdx - 1);
    } else if (idx === items.length - 1) {
      // jumped to clone of first -> go to real first
      scrollRef.current?.scrollTo({ x: bannerWidth, animated: false });
      currentIndexRef.current = 1;
      currentXRef.current = bannerWidth;
      setCurrentIndex(0);
    } else {
      currentIndexRef.current = idx;
      currentXRef.current = idx * bannerWidth;
      setCurrentIndex(idx - 1);
    }
  }

  function onMomentumScrollEnd(e: any) {
    const x = e.nativeEvent.contentOffset.x;
    currentXRef.current = x;
    let idx = Math.round(x / bannerWidth);
    // if at cloned edges, jump without animation
    if (idx === 0) {
      const realIdx = banners.length;
      scrollRef.current?.scrollTo({ x: realIdx * bannerWidth, animated: false });
      currentIndexRef.current = realIdx;
      currentXRef.current = realIdx * bannerWidth;
      setCurrentIndex(realIdx - 1);
    } else if (idx === items.length - 1) {
      scrollRef.current?.scrollTo({ x: bannerWidth, animated: false });
      currentIndexRef.current = 1;
      currentXRef.current = bannerWidth;
      setCurrentIndex(0);
    } else {
      currentIndexRef.current = idx;
      setCurrentIndex(idx - 1);
    }
  }

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={(e) => {
          currentXRef.current = e.nativeEvent.contentOffset.x;
        }}
        onScrollBeginDrag={() => {
          // user started interacting — pause autoplay for 5s
          pauseAutoplayFor(5000);
        }}
        onTouchStart={() => {
          // also pause on touch start
          pauseAutoplayFor(5000);
        }}
        onMomentumScrollBegin={() => {
          // user initiated momentum — pause autoplay briefly
          pauseAutoplayFor(5000);
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {items.map((banner, i) => (
          <View key={i} style={{ width: bannerWidth, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                console.log('Banner pressed:', banner.id);
                if (banner.id) {
                  console.log('Navigating to deal:', banner.id);
                  router.push(`/deal-detail?dealId=${banner.id}`);
                } else {
                  console.log('No banner.id found');
                }
              }}
              activeOpacity={0.9}
              style={{ width: '100%' }}
            >
              <Image source={banner.source} style={styles.bannerImage} />
            </TouchableOpacity>
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

function MenuIconsScroll() {
  const router = useRouter();

  const menuIcons = [
    { id: 'flower', name: 'Flower', category: 'FLOWER', source: require('../../assets/menu-icons/flower.png') },
    { id: 'preroll', name: 'Pre-Roll', category: 'PREROLL', source: require('../../assets/menu-icons/preroll.png') },
    { id: 'edible', name: 'Edible', category: 'EDIBLE', source: require('../../assets/menu-icons/edible.png') },
    { id: 'extract', name: 'Extract', category: 'EXTRACT', source: require('../../assets/menu-icons/extract.png') },
    { id: 'beverage', name: 'Beverage', category: 'BEVERAGE', source: require('../../assets/menu-icons/beverage.png') },
    { id: 'tincture', name: 'Tincture', category: 'TINCTURE', source: require('../../assets/menu-icons/tincture.png') },
    { id: 'topical', name: 'Topical', category: 'TOPICAL', source: require('../../assets/menu-icons/topical.png') },
    { id: 'pill', name: 'Pill', category: 'PILL', source: require('../../assets/menu-icons/pill.png') },
    { id: 'merch', name: 'Merch', category: 'MERCH', source: require('../../assets/menu-icons/merch.png') },
    { id: 'cart', name: 'Cart', category: 'CARTRIDGE', source: require('../../assets/menu-icons/cart.png') },
  ];

  const handleIconPress = (category: string) => {
    router.push({
      pathname: '/shop',
      params: { category },
    });
  };

  return (
    <View style={styles.menuIconsContainer}>
      <LinearGradient
        colors={['#121212', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradientLeft}
        pointerEvents="none"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.menuIconsContent}
        decelerationRate="fast"
        snapToInterval={90}
      >
        {menuIcons.map((icon) => (
          <TouchableOpacity
            key={icon.id}
            style={styles.menuIconItem}
            onPress={() => handleIconPress(icon.category)}
            activeOpacity={0.7}
          >
            <Image source={icon.source} style={styles.menuIcon} />
            <Text style={styles.menuIconText}>{icon.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <LinearGradient
        colors={['transparent', '#121212']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradientRight}
        pointerEvents="none"
      />
    </View>
  );
}

function RememberMeCart() {
  const router = useRouter();
  const { items } = useCart();

  if (items.length === 0) {
    return null;
  }

  // Get a random cart item
  const randomItem = items[Math.floor(Math.random() * items.length)];
  const product = dummyProductsData.data.stock.find(
    (p) => p.product_id === randomItem.product_id
  );

  if (!product) {
    return null;
  }

  return (
    <View style={styles.rememberMeContainer}>
      <Text style={styles.rememberMeTitle}>Remember me?</Text>
      <Image
        source={{ uri: product.image_url || 'https://via.placeholder.com/200' }}
        style={styles.rememberMeImage}
        resizeMode="cover"
      />
      <Text style={styles.rememberMeProductName} numberOfLines={2}>
        {product.product_name}
      </Text>
      <Text style={styles.rememberMeProductBrand}>{product.product_brand}</Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={() => router.push('/(tabs)/shop')}
        activeOpacity={0.8}
      >
        <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

function UpcomingEvent() {
  const router = useRouter();
  const events: Event[] = eventsData.data;

  const getNextUpcomingEvent = () => {
    const now = new Date();
    const upcomingEvents = events
      .filter(event => new Date(event.start_time) > now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  };

  const formatEventTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const dateStr = start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const startTimeStr = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const endTimeStr = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return {
      date: dateStr,
      time: `${startTimeStr} - ${endTimeStr}`
    };
  };

  const nextEvent = getNextUpcomingEvent();

  if (!nextEvent) {
    return null;
  }

  const { date, time } = formatEventTime(nextEvent.start_time, nextEvent.end_time);

  return (
    <TouchableOpacity
      style={styles.upcomingEventContainer}
      onPress={() => router.push('/entertainment')}
      activeOpacity={0.8}
    >
      <Image
        source={EVENT_IMAGES[nextEvent.photo]}
        style={styles.eventImage}
        resizeMode="cover"
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>{nextEvent.title}</Text>
        <Text style={styles.eventDate}>{date}</Text>
        <Text style={styles.eventTime}>{time}</Text>
        <Text style={styles.eventDescription} numberOfLines={3}>
          {nextEvent.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function App() {
  const { isLoggedIn, userData } = useUser();
  const { activeOrder } = useOrders();
  const [authModalVisible, setAuthModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Image source={require('../../assets/images/header-image.png')} style={styles.headerImage} />
      <Text style={styles.title}>San Francisco's Original Dispensary and Lounge</Text>

      {/* Divider */}
      <Image source={require('../../assets/images/divider.png')} style={styles.divider} />

      {/* Order Tracker for Active Orders */}
      {isLoggedIn && activeOrder && (
        <>
          <OrderTracker order={activeOrder} compact />
          <Image source={require('../../assets/images/divider.png')} style={styles.divider} />
        </>
      )}

      {/* Welcome Message for Logged In Users (only shown if no active order) */}
      {isLoggedIn && userData && !activeOrder && (
        <>
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeMessage}>Welcome back, {userData.firstName}!</Text>
            <Text style={styles.rewardsBalance}>Rewards: ${userData.rewardsBalance.toFixed(2)}</Text>
          </View>
          <Image source={require('../../assets/images/divider.png')} style={styles.divider} />
        </>
      )}

      {/* Sign In Prompt for Non-Logged In Users */}
      {!isLoggedIn && (
        <>
          <View style={styles.authPromptContainer}>
            <Text style={styles.authPromptTitle}>Sign In to View Our Menu & Deals</Text>
            <Text style={styles.authPromptText}>
              Create an account or sign in to access our full menu, exclusive deals, and more.
            </Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => setAuthModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
            </TouchableOpacity>
          </View>
          <Image source={require('../../assets/images/divider.png')} style={styles.divider} />
        </>
      )}

      {/* Only show content if logged in */}
      {isLoggedIn && (
        <>
          {/* Deals Carousel */}
          <Text style={styles.label}>Daily Deals!</Text>
          <BannerCarousel />

          {/* Divider */}
          <Image source={require('../../assets/images/divider.png')} style={styles.divider} />

          {/* Menu Icons Scroll */}
          <Text style={styles.label}>Shop By Category</Text>
          <MenuIconsScroll />

          {/* Divider */}
          <Image source={require('../../assets/images/divider.png')} style={styles.divider} />

          {/* Upcoming Event */}
          <Text style={styles.label}>Next Event</Text>
          <UpcomingEvent />

          {/* Remember Me Cart Section */}
          <RememberMeCart />
        </>
      )}

      {/* Auth Modal */}
      <AuthModal visible={authModalVisible} onClose={() => setAuthModalVisible(false)} />
    </ScrollView>
  );
}

// STYLES: Make your app look good!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 40,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Adamina-Regular',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 24
  },
  welcomeBox: {
    width: '100%',
    backgroundColor: '#FCBF27',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeMessage: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
    marginBottom: 8,
  },
  rewardsBalance: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#121212',
    textAlign: 'center',
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
    marginBottom: 24,
  },
  bannerImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  divider: {
    maxWidth: '100%',
    height: 15,
    alignContent: 'center',
    marginBottom: 24,
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
    fontSize: 24,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '600',
    letterSpacing: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    color: '#FCBF27',
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
  menuIconsContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    marginBottom: 24,
  },
  menuIconsContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  menuIconItem: {
    width: 70,
    alignItems: 'center',
    marginRight: 10,
  },
  menuIcon: {
    width: 82,
    height: 82,
    resizeMode: 'stretch',
    marginBottom: 8,
  },
  menuIconText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    textAlign: 'center',
  },
  gradientLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
    zIndex: 1,
  },
  gradientRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
    zIndex: 1,
  },
  upcomingEventContainer: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCBF27',
    overflow: 'hidden',
    marginBottom: 24,
  },
  eventImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#121212',
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 12,
  },
  eventDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.9,
    lineHeight: 20,
  },
  rememberMeContainer: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCBF27',
    padding: 20,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  rememberMeTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 16,
    textAlign: 'center',
  },
  rememberMeImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#121212',
    marginBottom: 16,
  },
  rememberMeProductName: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 8,
  },
  rememberMeProductBrand: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  continueShoppingButton: {
    backgroundColor: '#FCBF27',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  continueShoppingButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  authPromptContainer: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCBF27',
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  authPromptTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 16,
  },
  authPromptText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 20,
  },
  signInButton: {
    backgroundColor: '#FCBF27',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
});