import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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

interface CartItemWithProduct {
  product: Product;
  quantity: number;
}

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, clearCart } = useCart();

  const cartItemsWithProducts: CartItemWithProduct[] = useMemo(() => {
    return items
      .map((item) => {
        const product = dummyProductsData.data.stock.find(
          (p) => p.product_id === item.product_id
        );
        if (product) {
          return {
            product: product as Product,
            quantity: item.quantity,
          };
        }
        return null;
      })
      .filter((item): item is CartItemWithProduct => item !== null);
  }, [items]);

  const totalPrice = useMemo(() => {
    return cartItemsWithProducts.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cartItemsWithProducts]);

  const handleIncrement = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      updateQuantity(productId, 0);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      'Remove Item',
      `Remove ${productName} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => updateQuantity(productId, 0),
        },
      ]
    );
  };

  const handlePlaceOrder = () => {
    Alert.alert(
      'Place Pickup Order',
      `Total: $${totalPrice.toFixed(2)}\n\nThis feature is coming soon!`,
      [{ text: 'OK' }]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItemWithProduct }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product.image_url || 'https://via.placeholder.com/80' }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.brand} numberOfLines={1}>
          {item.product.product_brand}
        </Text>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product.product_name}
        </Text>
        <Text style={styles.price}>${item.product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.trashButton}
          onPress={() => handleRemoveItem(item.product.product_id, item.product.product_name)}
        >
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleDecrement(item.product.product_id, item.quantity)}
          >
            <Ionicons name="remove" size={20} color="#FCBF27" />
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleIncrement(item.product.product_id, item.quantity)}
          >
            <Ionicons name="add" size={20} color="#FCBF27" />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemTotal}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={100} color="#666" />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => router.push('/(tabs)/shop')}
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FCBF27" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({items.length})</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItemsWithProducts.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItemsWithProducts}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.product_id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
              <Text style={styles.placeOrderButtonText}>Place Pickup Order</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FCBF27',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginLeft: 12,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FF6B6B',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCBF27',
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
    justifyContent: 'center',
  },
  brand: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#FCBF27',
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
  price: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  quantityContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  trashButton: {
    padding: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#FCBF27',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    minWidth: 32,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 16,
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: '#FCBF27',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#FCBF27',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  totalPrice: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  placeOrderButton: {
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
});
