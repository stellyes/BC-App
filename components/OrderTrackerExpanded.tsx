import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order, OrderStatus, useOrders } from '../contexts/OrderContext';

interface OrderTrackerExpandedProps {
  order: Order;
  showDebugControls?: boolean; // Optional debug controls for testing
}

const STATUS_STEPS: OrderStatus[] = [
  'VERIFICATION_PENDING',
  'AWAITING_PROCESSING',
  'IN_PROCESS',
  'PACKED_READY',
  'COMPLETED'
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  VERIFICATION_PENDING: 'Verification Pending',
  AWAITING_PROCESSING: 'Awaiting Processing',
  IN_PROCESS: 'Processing...',
  PACKED_READY: 'Ready for Pickup',
  COMPLETED: 'Completed!'
};

export default function OrderTrackerExpanded({ order, showDebugControls = false }: OrderTrackerExpandedProps) {
  const { getOrderProcessingTime, updateOrderStatus, completeOrder } = useOrders();
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const currentStepIndex = STATUS_STEPS.indexOf(order.order_status);

  const handleNextStatus = () => {
    const currentIndex = STATUS_STEPS.indexOf(order.order_status);
    if (currentIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentIndex + 1];
      if (nextStatus === 'COMPLETED') {
        completeOrder(order.ticket_id);
      } else {
        updateOrderStatus(order.ticket_id, nextStatus);
      }
    }
  };

  const handlePreviousStatus = () => {
    const currentIndex = STATUS_STEPS.indexOf(order.order_status);
    if (currentIndex > 0) {
      const previousStatus = STATUS_STEPS[currentIndex - 1];
      updateOrderStatus(order.ticket_id, previousStatus);
    }
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
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Track your order</Text>

      {/* Order Info */}
      <View style={styles.orderInfo}>
        <View style={styles.orderInfoLeft}>
          <Ionicons name="cube-outline" size={24} color="#FCBF27" />
          <View>
            <Text style={styles.orderNumber}>{order.order_number}</Text>
            <Text style={styles.orderDate}>{formatDate(order.date_created)}</Text>
          </View>
        </View>
        <View style={styles.orderInfoRight}>
          <Text style={styles.processingTime}>{getOrderProcessingTime(order)}</Text>
          <View style={styles.orderTypeBadge}>
            <Text style={styles.orderTypeText}>{order.type}</Text>
          </View>
        </View>
      </View>

      {/* Status Tracker */}
      <View style={styles.statusTracker}>
        {STATUS_STEPS.map((status, index) => {
          const isActive = index <= currentStepIndex;

          return (
            <View key={status} style={styles.statusStep}>
              {/* Step Circle */}
              <View style={[styles.stepCircle, isActive && styles.stepCircleActive]}>
                {isActive && <View style={styles.stepCircleInner} />}
              </View>

              {/* Step Line (except for last step) */}
              {index < STATUS_STEPS.length - 1 && (
                <View style={[styles.stepLine, isActive && styles.stepLineActive]} />
              )}
            </View>
          );
        })}
      </View>

      {/* Current Status Label */}
      <Text style={styles.statusLabel}>{STATUS_LABELS[order.order_status]}</Text>

      {/* Debug Controls */}
      {showDebugControls && (
        <View style={styles.debugControls}>
          <Text style={styles.debugLabel}>DEBUG: Update Status</Text>
          <View style={styles.debugButtons}>
            <TouchableOpacity
              style={[styles.debugButton, currentStepIndex === 0 && styles.debugButtonDisabled]}
              onPress={handlePreviousStatus}
              disabled={currentStepIndex === 0}
            >
              <Ionicons name="arrow-back" size={16} color={currentStepIndex === 0 ? '#666' : '#FCBF27'} />
              <Text style={[styles.debugButtonText, currentStepIndex === 0 && styles.debugButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.debugButton, currentStepIndex === STATUS_STEPS.length - 1 && styles.debugButtonDisabled]}
              onPress={handleNextStatus}
              disabled={currentStepIndex === STATUS_STEPS.length - 1}
            >
              <Text style={[styles.debugButtonText, currentStepIndex === STATUS_STEPS.length - 1 && styles.debugButtonTextDisabled]}>
                {currentStepIndex === STATUS_STEPS.length - 2 ? 'Complete Order' : 'Next'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={currentStepIndex === STATUS_STEPS.length - 1 ? '#666' : '#FCBF27'} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Order Details Dropdown */}
      <TouchableOpacity
        style={styles.detailsToggle}
        onPress={() => setDetailsExpanded(!detailsExpanded)}
      >
        <Text style={styles.detailsToggleText}>Order Details</Text>
        <Ionicons
          name={detailsExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#FCBF27"
        />
      </TouchableOpacity>

      {/* Expanded Details */}
      {detailsExpanded && (
        <View style={styles.detailsContent}>
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

          {/* Payment Status */}
          <View style={styles.paymentStatus}>
            <Text style={styles.paymentStatusLabel}>Payment Status:</Text>
            <Text style={[
              styles.paymentStatusValue,
              order.payment_status === 'PAID' && styles.paymentStatusPaid
            ]}>
              {order.payment_status}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderInfoRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  orderNumber: {
    fontSize: 16,
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
  processingTime: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.7,
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
  statusTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a3a3a',
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    borderColor: '#FCBF27',
    backgroundColor: '#FCBF27',
  },
  stepCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#121212',
  },
  stepLine: {
    width: 35,
    height: 2,
    backgroundColor: '#3a3a3a',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#FCBF27',
  },
  statusLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  detailsToggleText: {
    fontSize: 14,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  detailsContent: {
    marginTop: 16,
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
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  paymentStatusLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.7,
  },
  paymentStatusValue: {
    fontSize: 14,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  paymentStatusPaid: {
    color: '#4CAF50',
  },
  debugControls: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  debugLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  debugButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  debugButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FCBF27',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  debugButtonDisabled: {
    borderColor: '#666',
    opacity: 0.5,
  },
  debugButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  debugButtonTextDisabled: {
    color: '#666',
  },
});
