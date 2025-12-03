import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import ProductCard from '../../components/ProductCard';
import FilterMenu, { FilterOptions } from '../../components/FilterMenu';
import { useCart } from '../../contexts/CartContext';
import dummyProductsData from '../../data/dummy-products.json';

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
}

const VALID_PRODUCT_TYPES = [
  'BEVERAGE',
  'CARTRIDGE',
  'EDIBLE',
  'EXTRACT',
  'FLOWER',
  'MERCH',
  'PILL',
  'PREROLL',
  'TINCTURE',
  'TOPICAL',
];

export default function ShopScreen() {
  const params = useLocalSearchParams();
  const categoryParam = params.category as string | undefined;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    maxPrice: '',
    classifications: [],
    potency: '',
    potencyUnit: 'mg',
  });
  const { itemCount } = useCart();

  useEffect(() => {
    // Load all valid products
    const filteredProducts = dummyProductsData.data.stock.filter((product) =>
      VALID_PRODUCT_TYPES.includes(product.product_type)
    );
    setAllProducts(filteredProducts);
  }, []);

  // Apply category filter from navigation params
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryParam],
      }));
    }
  }, [categoryParam]);

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.product_type)
      );
    }

    // Filter by max price
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        result = result.filter((product) => product.price <= maxPrice);
      }
    }

    // Filter by classifications
    if (filters.classifications.length > 0) {
      result = result.filter(
        (product) =>
          product.classification &&
          filters.classifications.includes(product.classification)
      );
    }

    // Filter by potency
    if (filters.potency) {
      const targetPotency = parseFloat(filters.potency);
      if (!isNaN(targetPotency)) {
        result = result.filter((product) => {
          if (!product.potency) return false;

          // Extract numeric value and unit from potency string
          const match = product.potency.match(/^(\d+(?:\.\d+)?)(mg|g|%)/);
          if (!match) return false;

          const [, valueStr, unit] = match;
          const value = parseFloat(valueStr);

          // Check if unit matches and value is less than or equal to target
          return unit === filters.potencyUnit && value <= targetPotency;
        });
      }
    }

    return result;
  }, [allProducts, filters]);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <ProductCard product={item} />
    </View>
  );

  const handleCartPress = () => {
    setMenuVisible(false);
    // TODO: Navigate to cart screen
    console.log('Navigate to cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="menu" size={28} color="#FCBF27" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.product_id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <FilterMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        cartItemCount={itemCount}
        onCartPress={handleCartPress}
        filters={filters}
        onFiltersChange={setFilters}
      />
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
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  menuButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    maxWidth: '48%',
  },
});
