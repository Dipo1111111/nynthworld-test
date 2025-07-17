import { useCart } from '../hooks/useCart.jsx';
import { Link } from 'react-router-dom';

const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  
  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Your Cart ({cart.reduce((total, item) => total + (item.quantity || 0), 0)})
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={`${item.id}-${item.selectedColor.id}`} className="border-b pb-4">
                  <div className="flex gap-4">
                    <img 
                      src={item.selectedColor.image} 
                      alt={`${item.name} in ${item.selectedColor.name}`}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">Color: {item.selectedColor.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                      <p className="font-medium">
                        ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between mb-4">
              <span>Subtotal:</span>
              <span className="font-medium">
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>
            <Link 
              to="/checkout" 
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-black text-white py-3 text-center hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;