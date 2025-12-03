import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  product_id: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const addItem = (productId: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product_id: productId, quantity: 1 }];
    });
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
      value={{ items, itemCount, addItem, removeItem, clearCart }}
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
