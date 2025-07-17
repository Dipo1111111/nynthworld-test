import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg mb-4">Your cart is empty</p>
            <Link 
              to="/products" 
              className="inline-block bg-black text-white py-3 px-6 hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedColor.id}`} className="border-b pb-6">
                    <div className="flex gap-6">
                      <img 
                        src={item.selectedColor.image} 
                        alt={`${item.name} in ${item.selectedColor.name}`}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1">
                        <h2 className="text-xl font-medium">{item.name}</h2>
                        <p className="text-gray-600">Color: {item.selectedColor.name}</p>
                        <p className="text-lg font-medium mt-2">₦{item.price.toLocaleString()}</p>
                        
                        <div className="flex items-center mt-4">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedColor.id, item.quantity - 1)}
                            className="px-3 py-1 border border-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedColor.id, item.quantity + 1)}
                            className="px-3 py-1 border border-gray-300"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedColor.id)}
                            className="ml-4 text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="border p-6 h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full bg-black text-white py-3 text-center hover:bg-gray-800 transition mt-6"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;