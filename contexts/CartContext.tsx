import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  product_id: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const addItem = (productId: string, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product_id: productId, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
      return;
    }
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        );
      }
      return [...prevItems, { product_id: productId, quantity }];
    });
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === productId);
      if (!existingItem) return prevItems;

      if (existingItem.quantity === 1) {
        return prevItems.filter((item) => item.product_id !== productId);
      }

      return prevItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, itemCount, addItem, removeItem, updateQuantity, clearCart, getItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
