import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

interface ProductCardProps {
  product: {
    product_id: string;
    product_name: string;
    product_brand: string;
    product_type: string;
    classification?: string | null;
    potency?: string | null;
    price: number;
    weight?: string | null;
    image_url?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number, weight?: string | null) => {
    if (weight) {
      return `$${price.toFixed(2)} / ${weight}`;
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.image_url || 'https://via.placeholder.com/150' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.brand} numberOfLines={1}>
          {product.product_brand}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.product_name}
        </Text>
        <Text style={styles.classification}>
          {product.classification || ' '}
        </Text>
        <Text style={styles.potency}>
          {product.potency || ' '}
        </Text>
        <Text style={styles.price}>
          {formatPrice(product.price, product.weight)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCBF27',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#121212',
  },
  info: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#FCBF27',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 8,
    lineHeight: 20,
  },
  classification: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    fontWeight: '600',
    marginBottom: 4,
  },
  potency: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
});
