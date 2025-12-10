import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Order, OrderStatus, useOrders } from '../contexts/OrderContext';

interface OrderTrackerProps {
  order: Order;
  compact?: boolean;
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

export default function OrderTracker({ order, compact = false }: OrderTrackerProps) {
  const { getOrderProcessingTime } = useOrders();
  const currentStepIndex = STATUS_STEPS.indexOf(order.order_status);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Track your order</Text>

      {/* Order Info */}
      <View style={styles.orderInfo}>
        <View style={styles.orderInfoLeft}>
          <Ionicons name="cube-outline" size={24} color="#FCBF27" />
          <Text style={styles.orderNumber}>{order.order_number}</Text>
        </View>
        <Text style={styles.processingTime}>{getOrderProcessingTime(order)}</Text>
      </View>

      {/* Status Tracker */}
      <View style={styles.statusTracker}>
        {STATUS_STEPS.map((status, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrentStep = index === currentStepIndex;

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

      {/* Compact mode doesn't show step labels */}
      {!compact && (
        <View style={styles.stepLabels}>
          {STATUS_STEPS.map((status, index) => (
            <Text
              key={status}
              style={[
                styles.stepLabelText,
                index <= currentStepIndex && styles.stepLabelTextActive
              ]}
            >
              {STATUS_LABELS[status]}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  header: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 16,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  processingTime: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.8,
  },
  statusTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#121212',
  },
  stepLine: {
    width: 32,
    height: 3,
    backgroundColor: '#3a3a3a',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#FCBF27',
  },
  statusLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    textAlign: 'center',
  },
  stepLabels: {
    marginTop: 12,
    gap: 4,
  },
  stepLabelText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.5,
  },
  stepLabelTextActive: {
    opacity: 1,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
  },
});
