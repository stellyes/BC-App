import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useOrders, Order } from '../contexts/OrderContext';

export default function PastPurchasesScreen() {
  const router = useRouter();
  const { pastOrders } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FCBF27" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Past Purchases</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {pastOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#FCBF27" />
            <Text style={styles.emptyText}>No past purchases</Text>
            <Text style={styles.emptySubtext}>Your completed orders will appear here</Text>
          </View>
        ) : (
          pastOrders.map((order) => (
            <View key={order.ticket_id} style={styles.orderCard}>
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View style={styles.orderHeaderLeft}>
                  <Ionicons name="receipt" size={24} color="#FCBF27" />
                  <View style={styles.orderHeaderInfo}>
                    <Text style={styles.orderNumber}>{order.order_number}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.date_created)}</Text>
                  </View>
                </View>
                <View style={styles.orderHeaderRight}>
                  <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                  <View style={styles.orderTypeBadge}>
                    <Text style={styles.orderTypeText}>{order.type}</Text>
                  </View>
                </View>
              </View>

              {/* Order Summary */}
              <View style={styles.orderSummary}>
                <Text style={styles.orderSummaryText}>
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.orderStatusText}>Completed</Text>
              </View>

              {/* Expand/Collapse Button */}
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleOrderExpand(order.ticket_id)}
              >
                <Text style={styles.expandButtonText}>
                  {expandedOrderId === order.ticket_id ? 'Hide Details' : 'View Details'}
                </Text>
                <Ionicons
                  name={expandedOrderId === order.ticket_id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#FCBF27"
                />
              </TouchableOpacity>

              {/* Expanded Details */}
              {expandedOrderId === order.ticket_id && (
                <View style={styles.orderDetails}>
                  <View style={styles.divider} />

                  {/* Items List */}
                  <Text style={styles.detailsHeader}>Items</Text>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.product_size_name}</Text>
                        <Text style={styles.itemMeta}>
                          {item.product_brand} • {item.product_type}
                        </Text>
                        <Text style={styles.itemMeta}>
                          {item.product_amount}{item.product_unit.toLowerCase()}
                        </Text>
                      </View>
                      <View style={styles.itemPricing}>
                        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                        <Text style={styles.itemPrice}>${item.price_total.toFixed(2)}</Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.divider} />

                  {/* Price Breakdown */}
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Subtotal</Text>
                    <Text style={styles.priceValue}>${order.sub_total.toFixed(2)}</Text>
                  </View>
                  {order.discount_total < 0 && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabelDiscount}>Discount</Text>
                      <Text style={styles.priceValueDiscount}>
                        -${Math.abs(order.discount_total).toFixed(2)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Tax</Text>
                    <Text style={styles.priceValue}>${order.tax_total.toFixed(2)}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.priceRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                  </View>

                  {/* Delivery Info */}
                  {order.delivery_address && (
                    <>
                      <View style={styles.divider} />
                      <Text style={styles.detailsHeader}>Delivery Address</Text>
                      <Text style={styles.addressText}>
                        {order.delivery_address.street}
                        {order.delivery_address.street2 && `, ${order.delivery_address.street2}`}
                      </Text>
                      <Text style={styles.addressText}>
                        {order.delivery_address.city}, {order.delivery_address.state}{' '}
                        {order.delivery_address.zip}
                      </Text>
                    </>
                  )}
                </View>
              )}
            </View>
          ))
        )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FCBF27',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.6,
    marginTop: 8,
  },
  orderCard: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderHeaderInfo: {
    gap: 4,
  },
  orderNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  orderDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.7,
  },
  orderHeaderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  orderTotal: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  orderTypeBadge: {
    backgroundColor: '#FCBF27',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orderTypeText: {
    fontSize: 10,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderSummaryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  orderStatusText: {
    fontSize: 14,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#4CAF50',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  expandButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  orderDetails: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#FCBF27',
    opacity: 0.3,
    marginVertical: 12,
  },
  detailsHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  itemMeta: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.7,
  },
  itemPricing: {
    alignItems: 'flex-end',
    gap: 2,
  },
  itemQuantity: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.7,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  priceLabelDiscount: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4CAF50',
  },
  priceValueDiscount: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4CAF50',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 4,
  },
});
