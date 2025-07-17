// src/context/CartProvider.jsx
import { useState } from 'react';
import CartContext from './CartContext';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (product) => {
    setCart(prevCart => {
      // Find if this exact product (same ID + same color) already exists in cart
      const existingIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedColor.id === product.selectedColor.id
      );

      if (existingIndex >= 0) {
        // If exists, update quantity only
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + product.quantity,
          totalPrice: updatedCart[existingIndex].price * (updatedCart[existingIndex].quantity + product.quantity)
        };
        return updatedCart;
      }

      // If new item, add to cart
      return [...prevCart, {
        ...product,
        totalPrice: product.price * product.quantity
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, colorId) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.id === productId && item.selectedColor.id === colorId)
      )
    );
  };

  const updateQuantity = (productId, colorId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item =>
        item.id === productId && item.selectedColor.id === colorId
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      setCart,
      isCartOpen, 
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};