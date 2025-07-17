// contexts/CartContext.js
import { createContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity, selectedColor) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && item.color === selectedColor
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.color === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [
        ...prevItems,
        {
          ...product,
          quantity,
          color: selectedColor,
          colorImage: product.colors.find(c => c.id === selectedColor).image
        }
      ];
    });
    setIsCartOpen(true);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;