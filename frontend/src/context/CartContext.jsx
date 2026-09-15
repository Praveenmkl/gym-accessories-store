import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'powerfit_cart';

const readInitialCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(readInitialCart);
  const [toastNotification, setToastNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const showNotification = (notification) => {
    setToastNotification({ show: true, ...notification });
    if (window._toastTimeout) clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  const hideNotification = () => {
    if (window._toastTimeout) clearTimeout(window._toastTimeout);
    setToastNotification(null);
  };

  const addToCart = (product, quantity = 1) => {
    // Validate quantity against available stock
    const availableStock = product.quantity || 0;
    if (quantity > availableStock) {
      showNotification({
        type: 'error',
        message: `Only ${availableStock} items available in stock.`,
        product,
      });
      return false;
    }

    let success = true;
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      const totalQuantity = (existingItem?.quantity || 0) + quantity;

      // Check if total would exceed stock
      if (totalQuantity > availableStock) {
        showNotification({
          type: 'error',
          message: `Cannot add more. You already have ${existingItem?.quantity || 0} in cart (Stock: ${availableStock}).`,
          product,
        });
        success = false;
        return currentItems;
      }

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: totalQuantity }
            : item
        );
      }

      return [...currentItems, { ...product, quantity }];
    });

    if (success) {
      showNotification({
        type: 'success',
        message: `${product.name} added to your cart`,
        product,
        quantity,
      });
    }
    return success;
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const increaseQuantity = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    if (!item) return;
    updateQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    if (!item) return;
    updateQuantity(productId, item.quantity - 1);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const value = {
    cartItems,
    subtotal,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    toastNotification,
    hideNotification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }

  return context;
};
