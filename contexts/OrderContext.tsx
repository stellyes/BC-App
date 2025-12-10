import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OrderStatus =
  | 'VERIFICATION_PENDING'
  | 'AWAITING_PROCESSING'
  | 'IN_PROCESS'
  | 'PACKED_READY'
  | 'COMPLETED';

export interface OrderItem {
  product_id: string;
  product_size_name: string;
  product_type: string;
  product_brand: string;
  product_subtype: string;
  quantity: number;
  price_total: number;
  price_sell: number;
  product_unit: string;
  product_amount: number;
  discounts: Array<{
    discount_title: string;
    discount_amount: number;
    savings: number;
  }>;
  tax: Array<{
    rate: number;
    tax_name: string;
    amount: number;
  }>;
}

export interface Order {
  type: 'PICKUP' | 'DELIVERY';
  ticket_id: string;
  order_number: string;
  order_status: OrderStatus;
  payment_status: string;
  date_created: string;
  last_updated_at: string;
  date_closed: string | null;
  sub_total: number;
  tax_total: number;
  discount_total: number;
  total: number;
  items: OrderItem[];
  delivery_address?: any;
  delivery_route?: any;
}

interface OrderContextType {
  activeOrder: Order | null;
  pastOrders: Order[];
  createOrder: (items: any[], total: number) => Promise<Order>;
  completeOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderProcessingTime: (order: Order) => string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ACTIVE_ORDER_KEY = '@active_order';
const PAST_ORDERS_KEY = '@past_orders';

// Dummy past orders data
const DUMMY_PAST_ORDERS: Order[] = [
  {
    type: 'PICKUP',
    ticket_id: '02b0db6d-b118-4e50-9cd5-8dfba0166fd2',
    order_number: 'A3K9M2',
    order_status: 'COMPLETED',
    payment_status: 'PAID',
    date_created: '2024-12-01T14:30:00.000-08:00',
    last_updated_at: '2024-12-01T15:45:00.000-08:00',
    date_closed: '2024-12-01T15:45:00.000-08:00',
    sub_total: 45.00,
    tax_total: 12.35,
    discount_total: -5.00,
    total: 52.35,
    items: [
      {
        product_id: '83e1a132-ed63-40da-951a-cdb4183acc86',
        product_size_name: 'BLUE DREAM',
        product_type: 'FLOWER',
        product_brand: 'COOKIES',
        product_subtype: 'PRE-PACK',
        quantity: 2,
        price_total: 30.00,
        price_sell: 15.00,
        product_unit: 'GRAMS',
        product_amount: 3.5,
        discounts: [],
        tax: [
          { rate: 0.15, tax_name: 'Excise Tax', amount: 4.50 },
          { rate: 0.0975, tax_name: 'Sales Tax', amount: 2.93 }
        ]
      },
      {
        product_id: '94f2b243-fe74-51eb-a62b-fde5294bdd97',
        product_size_name: 'SOUR DIESEL',
        product_type: 'FLOWER',
        product_brand: 'ALIEN LABS',
        product_subtype: 'PRE-PACK',
        quantity: 1,
        price_total: 22.35,
        price_sell: 15.00,
        product_unit: 'GRAMS',
        product_amount: 3.5,
        discounts: [
          { discount_title: 'First Time Customer', discount_amount: 5.00, savings: 5.00 }
        ],
        tax: [
          { rate: 0.15, tax_name: 'Excise Tax', amount: 3.00 },
          { rate: 0.0975, tax_name: 'Sales Tax', amount: 1.92 }
        ]
      }
    ]
  },
  {
    type: 'DELIVERY',
    ticket_id: 'f5d8c9a1-3e27-4b89-9f12-7a8e6d4c2b91',
    order_number: 'B7X4P1',
    order_status: 'COMPLETED',
    payment_status: 'PAID',
    date_created: '2024-11-28T10:15:00.000-08:00',
    last_updated_at: '2024-11-28T16:30:00.000-08:00',
    date_closed: '2024-11-28T16:30:00.000-08:00',
    sub_total: 80.00,
    tax_total: 22.80,
    discount_total: -10.00,
    total: 97.80,
    items: [
      {
        product_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        product_size_name: 'GELATO',
        product_type: 'FLOWER',
        product_brand: 'CONNECTED',
        product_subtype: 'PRE-PACK',
        quantity: 2,
        price_total: 60.00,
        price_sell: 30.00,
        product_unit: 'GRAMS',
        product_amount: 7.0,
        discounts: [
          { discount_title: 'Bundle Discount', discount_amount: 10.00, savings: 10.00 }
        ],
        tax: [
          { rate: 0.15, tax_name: 'Excise Tax', amount: 9.00 },
          { rate: 0.0975, tax_name: 'Sales Tax', amount: 5.85 }
        ]
      },
      {
        product_id: 'z9y8x7w6-v5u4-3210-fedc-ba0987654321',
        product_size_name: 'WEDDING CAKE',
        product_type: 'CONCENTRATE',
        product_brand: 'RAW GARDEN',
        product_subtype: 'LIVE RESIN',
        quantity: 1,
        price_total: 37.80,
        price_sell: 20.00,
        product_unit: 'GRAMS',
        product_amount: 1.0,
        discounts: [],
        tax: [
          { rate: 0.15, tax_name: 'Excise Tax', amount: 3.00 },
          { rate: 0.0975, tax_name: 'Sales Tax', amount: 1.95 }
        ]
      }
    ],
    delivery_address: {
      street: '1611 Telegraph Ave',
      city: 'Oakland',
      state: 'CA',
      zip: '94612'
    }
  },
  {
    type: 'PICKUP',
    ticket_id: 'c8d7e6f5-a4b3-2c1d-0e9f-8a7b6c5d4e3f',
    order_number: 'C2N8V5',
    order_status: 'COMPLETED',
    payment_status: 'PAID',
    date_created: '2024-11-20T16:45:00.000-08:00',
    last_updated_at: '2024-11-20T17:20:00.000-08:00',
    date_closed: '2024-11-20T17:20:00.000-08:00',
    sub_total: 25.00,
    tax_total: 7.19,
    discount_total: 0,
    total: 32.19,
    items: [
      {
        product_id: 'p9o8i7u6-y5t4-3r2e-1w0q-azsxdcfvgbhn',
        product_size_name: 'OG KUSH',
        product_type: 'FLOWER',
        product_brand: 'BARBARY COAST',
        product_subtype: 'PRE-PACK',
        quantity: 1,
        price_total: 32.19,
        price_sell: 25.00,
        product_unit: 'GRAMS',
        product_amount: 3.5,
        discounts: [],
        tax: [
          { rate: 0.15, tax_name: 'Excise Tax', amount: 3.75 },
          { rate: 0.0975, tax_name: 'Sales Tax', amount: 2.44 }
        ]
      }
    ]
  }
];

function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>(DUMMY_PAST_ORDERS);

  useEffect(() => {
    loadActiveOrder();
    loadPastOrders();
  }, []);

  const loadActiveOrder = async () => {
    try {
      const saved = await AsyncStorage.getItem(ACTIVE_ORDER_KEY);
      if (saved) {
        setActiveOrder(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading active order:', error);
    }
  };

  const loadPastOrders = async () => {
    try {
      const saved = await AsyncStorage.getItem(PAST_ORDERS_KEY);
      if (saved) {
        setPastOrders(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading past orders:', error);
    }
  };

  const saveActiveOrder = async (order: Order | null) => {
    try {
      if (order) {
        await AsyncStorage.setItem(ACTIVE_ORDER_KEY, JSON.stringify(order));
      } else {
        await AsyncStorage.removeItem(ACTIVE_ORDER_KEY);
      }
    } catch (error) {
      console.error('Error saving active order:', error);
    }
  };

  const savePastOrders = async (orders: Order[]) => {
    try {
      await AsyncStorage.setItem(PAST_ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving past orders:', error);
    }
  };

  const createOrder = async (items: any[], total: number): Promise<Order> => {
    const now = new Date().toISOString();

    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = subTotal * 0.2875; // Combined tax rate
    const discountTotal = 0;

    const newOrder: Order = {
      type: 'PICKUP',
      ticket_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order_number: generateOrderNumber(),
      order_status: 'AWAITING_PROCESSING',
      payment_status: 'UNPAID',
      date_created: now,
      last_updated_at: now,
      date_closed: null,
      sub_total: subTotal,
      tax_total: taxTotal,
      discount_total: discountTotal,
      total: subTotal + taxTotal,
      items: items.map(item => ({
        product_id: item.id,
        product_size_name: item.name,
        product_type: item.category || 'FLOWER',
        product_brand: item.brand || 'BARBARY COAST',
        product_subtype: item.type || 'PRE-PACK',
        quantity: item.quantity,
        price_total: (item.price * item.quantity) * 1.2875,
        price_sell: item.price,
        product_unit: 'GRAMS',
        product_amount: 3.5,
        discounts: [],
        tax: [
          { rate: 0.15, tax_name: 'Excise Tax', amount: item.price * item.quantity * 0.15 },
          { rate: 0.0975, tax_name: 'Sales Tax', amount: item.price * item.quantity * 0.0975 },
          { rate: 0.04, tax_name: 'City Tax', amount: item.price * item.quantity * 0.04 }
        ]
      }))
    };

    setActiveOrder(newOrder);
    await saveActiveOrder(newOrder);

    return newOrder;
  };

  const completeOrder = async (orderId: string) => {
    if (activeOrder && activeOrder.ticket_id === orderId) {
      const completedOrder: Order = {
        ...activeOrder,
        order_status: 'COMPLETED',
        date_closed: new Date().toISOString(),
        last_updated_at: new Date().toISOString(),
        payment_status: 'PAID'
      };

      const updatedPastOrders = [completedOrder, ...pastOrders];
      setPastOrders(updatedPastOrders);
      await savePastOrders(updatedPastOrders);

      setActiveOrder(null);
      await saveActiveOrder(null);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (activeOrder && activeOrder.ticket_id === orderId) {
      const updatedOrder: Order = {
        ...activeOrder,
        order_status: status,
        last_updated_at: new Date().toISOString()
      };

      setActiveOrder(updatedOrder);
      await saveActiveOrder(updatedOrder);
    }
  };

  const getOrderProcessingTime = (order: Order): string => {
    const created = new Date(order.date_created);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <OrderContext.Provider
      value={{
        activeOrder,
        pastOrders,
        createOrder,
        completeOrder,
        updateOrderStatus,
        getOrderProcessingTime
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
