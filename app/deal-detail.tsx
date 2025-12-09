import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dummyProductsData from '../data/dummy-products.json';
import { useCart } from '../contexts/CartContext';

interface DealFilters {
  brand?: string;
  category?: string;
  brands?: string[];
  categories?: string[];
}

interface Deal {
  id: string;
  title: string;
  description: string;
  bannerImage: any;
  filters: DealFilters;
}

// Sample deal data structure with filtering parameters
const DEALS_DATA: { [key: string]: Deal } = {
  '1': {
    id: '1',
    title: 'Jetty Extracts BOGO',
    description: 'Buy one Jetty product, get one 50% off!',
    bannerImage: require('../assets/mobilebanners/jettymobilebanner.png'),
    filters: {
      brand: 'Jetty',
    },
  },
  '2': {
    id: '2',
    title: 'Brite Labs Deal',
    description: 'Special pricing on all Brite Labs products!',
    bannerImage: require('../assets/mobilebanners/britemobilebanner.png'),
    filters: {
      brand: 'Brite Labs',
    },
  },
  '3': {
    id: '3',
    title: 'KIND Edibles Sale',
    description: '20% off all KIND edibles - today only!',
    bannerImage: require('../assets/mobilebanners/KINDmobilebanner.png'),
    filters: {
      brand: 'KIND',
      category: 'EDIBLE',
    },
  },
  '4': {
    id: '4',
    title: 'Fields Family Farms: B2G1 for $1',
    description: 'Buy any 2 Fields Family Farms prerolls and get a third for just $1!',
    bannerImage: require('../assets/mobilebanners/FFFmobilebanner.png'),
    filters: {
      brand: 'Fields Family Farms',
      category: 'PREROLL',
    },
  },
  '5': {
    id: '5',
    title: 'Beverage Bonanza',
    description: 'All beverages on special this week!',
    bannerImage: require('../assets/mobilebanners/ICEDmobilebanner.png'),
    filters: {
      category: 'BEVERAGE',
    },
  },
};

interface Product {
  product_id: string;
  product_name: string;
  product_brand: string;
  product_type: string;
  price: number;
  image_url: string;
}

export default function DealDetailScreen() {
  const { dealId } = useLocalSearchParams<{ dealId: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  // Get the deal data based on the dealId
  const deal = DEALS_DATA[dealId as keyof typeof DEALS_DATA];

  // Filter products based on deal criteria
  const qualifyingProducts = useMemo(() => {
    if (!deal) return [];

    const allProducts = dummyProductsData.data.stock;
    const filters = deal.filters;

    return allProducts.filter((product) => {
      let matches = true;

      // Filter by single brand
      if (filters.brand) {
        matches = matches && product.product_brand === filters.brand;
      }

      // Filter by multiple brands (OR logic)
      if (filters.brands && filters.brands.length > 0) {
        matches = matches && filters.brands.includes(product.product_brand);
      }

      // Filter by single category
      if (filters.category) {
        matches = matches && product.product_type === filters.category;
      }

      // Filter by multiple categories (OR logic)
      if (filters.categories && filters.categories.length > 0) {
        matches = matches && filters.categories.includes(product.product_type);
      }

      return matches;
    });
  }, [deal]);

  if (!deal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Deal not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = (productId: string, productName: string) => {
    addItem(productId, 1);
    Alert.alert(
      'Added to Cart',
      `${productName} has been added to your cart.`,
      [
        {
          text: 'Continue Shopping',
          style: 'cancel',
        },
        {
          text: 'View Cart',
          onPress: () => router.push('/cart'),
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product-detail?productId=${item.product_id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.product_type}</Text>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.productBrand}>{item.product_brand}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={(e) => {
          e.stopPropagation();
          handleAddToCart(item.product_id, item.product_name);
        }}
      >
        <Ionicons name="add-circle" size={32} color="#FCBF27" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header Section */}
      <View style={styles.fixedHeader}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#FCBF27" />
        </TouchableOpacity>

        {/* Deal Banner */}
        <Image source={deal.bannerImage} style={styles.bannerImage} />

        {/* Deal Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.dealTitle}>{deal.title}</Text>
          <Text style={styles.dealDescription}>{deal.description}</Text>
        </View>
      </View>

      {/* Scrollable Products List */}
      <View style={styles.productsContainer}>
        <Text style={styles.productsHeader}>Qualifying Products</Text>
        {qualifyingProducts.length > 0 ? (
          <FlatList
            data={qualifyingProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.product_id}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="pricetag-outline" size={64} color="#FCBF27" />
            <Text style={styles.emptyStateText}>
              No products available for this deal yet.
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Check back soon for qualifying products!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  fixedHeader: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#FCBF27',
  },
  headerBackButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FCBF27',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  dealTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 8,
  },
  dealDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.9,
    lineHeight: 24,
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productsHeader: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginTop: 24,
    marginBottom: 16,
  },
  productsList: {
    paddingBottom: 24,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCBF27',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#121212',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productCategory: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.7,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.8,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FCBF27',
  },
  addButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#FCBF27',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
});
