import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import dummyProductsData from '../data/dummy-products.json';

interface Product {
  product_id: string;
  product_name: string;
  product_brand: string;
  product_type: string;
  classification?: string | null;
  potency?: string | null;
  price: number;
  weight?: string | null;
  image_url?: string;
  description?: string;
}

export default function ProductDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    const productId = params.productId as string;
    const foundProduct = dummyProductsData.data.stock.find(
      (p) => p.product_id === productId
    );
    if (foundProduct) {
      setProduct(foundProduct as Product);
    }
  }, [params.productId]);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const showToast = () => {
    setToastVisible(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToastVisible(false);
      });
    }, 2000);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product.product_id, quantity);
      showToast();
    }
  };

  const formatPrice = (price: number, weight?: string | null) => {
    if (weight) {
      return `$${price.toFixed(2)} / ${weight}`;
    }
    return `$${price.toFixed(2)}`;
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#FCBF27" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FCBF27" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      {toastVisible && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={24} color="#121212" />
          <Text style={styles.toastText}>
            Added {quantity} x {product?.product_name} to cart
          </Text>
        </Animated.View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.image_url || 'https://via.placeholder.com/400' }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.brand}>{product.product_brand}</Text>
          <Text style={styles.productName}>{product.product_name}</Text>

          <View style={styles.infoRow}>
            {product.classification && (
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{product.classification}</Text>
              </View>
            )}
            {product.potency && (
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{product.potency}</Text>
              </View>
            )}
            {product.weight && (
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{product.weight}</Text>
              </View>
            )}
          </View>

          <Text style={styles.price}>{formatPrice(product.price, product.weight)}</Text>

          {product.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                onPress={handleDecrement}
                disabled={quantity === 1}
              >
                <Ionicons name="remove" size={24} color={quantity === 1 ? '#666' : '#FCBF27'} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={handleIncrement}>
                <Ionicons name="add" size={24} color="#FCBF27" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  toast: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FCBF27',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  content: {
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#1a1a1a',
  },
  detailsContainer: {
    padding: 20,
  },
  brand: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#FCBF27',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  productName: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 16,
    lineHeight: 34,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  infoBadge: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCBF27',
  },
  infoBadgeText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  price: {
    fontSize: 32,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 24,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    lineHeight: 24,
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FCBF27',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    borderColor: '#666',
    backgroundColor: '#0a0a0a',
  },
  quantityValue: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    minWidth: 60,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#FCBF27',
  },
  addToCartButton: {
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
});
