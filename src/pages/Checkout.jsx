import { useCart } from '../hooks/useCart';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect } from 'react';
import Footer from '../components/Footer';

// Form validation schema
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2),
  lastName: yup.string().required('Last name is required').min(2),
  email: yup.string().email('Invalid email').required('Required'),
  phone: yup.string().required('Phone required').matches(/^\d{11}$/, 'Must be 11 digits'),
  address: yup.string().required('Address required').min(5),
  city: yup.string().required('City required').min(2),
  country: yup.string().required('Country required').min(2)
});

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema)
  });

  // Paystack config
  const paystackConfig = {
    reference: `PAY-${Date.now()}`,
    email: watch('email'),
    amount: cartTotal * 100, // in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer",
          variable_name: "customer",
          value: `${watch('firstName')} ${watch('lastName')}`
        }
      ]
    }
  };

  // Save order to Firebase
  const saveOrder = async (status = 'pending') => {
    const orderId = `ORD-${Date.now()}`;
    const orderData = {
      customer: {
        name: `${watch('firstName')} ${watch('lastName')}`,
        email: watch('email'),
        phone: watch('phone'),
        address: `${watch('address')}, ${watch('city')}, ${watch('country')}`
      },
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.selectedColor?.name || 'N/A'
      })),
      total: cartTotal,
      status,
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, "orders", orderId), orderData);
    return orderId;
  };

  // Payment handlers
  const onPaymentSuccess = async (response) => {
    try {
      await saveOrder('paid');
      clearCart();
      navigate('/thank-you', { state: { reference: response.reference } });
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Order failed - please contact support");
    }
  };

  const onPaymentClose = () => {
    alert("Payment window closed - complete your purchase later");
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const processPayment = async () => {
    try {
      await saveOrder(); // Save as pending first
      initializePayment(onPaymentSuccess, onPaymentClose);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Failed to process payment");
    }
  };

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart, navigate]);

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Checkout Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <div className="flex justify-center">
            <div className="w-full max-w-md border-t-2 border-black pt-2"></div>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 px-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mb-2">1</div>
            <span className="text-sm font-medium">Cart</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mb-2">2</div>
            <span className="text-sm font-medium">Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mb-2">3</div>
            <span className="text-sm text-gray-500">Payment</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">Customer Information</h2>
              
              <form onSubmit={handleSubmit(processPayment)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name*</label>
                    <input 
                      {...register('firstName')} 
                      className={`w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-black focus:border-transparent`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="mt-1 text-red-500 text-xs">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name*</label>
                    <input 
                      {...register('lastName')} 
                      className={`w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-black focus:border-transparent`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="mt-1 text-red-500 text-xs">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email*</label>
                  <input 
                    {...register('email')} 
                    className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="your@email.com"
                    type="email"
                  />
                  {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number*</label>
                  <input 
                    {...register('phone')} 
                    className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="08012345678"
                  />
                  {errors.phone && <p className="mt-1 text-red-500 text-xs">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Shipping Address*</label>
                  <input 
                    {...register('address')} 
                    className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-black focus:border-transparent`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="mt-1 text-red-500 text-xs">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City*</label>
                    <input 
                      {...register('city')} 
                      className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-black focus:border-transparent`}
                      placeholder="Lagos"
                    />
                    {errors.city && <p className="mt-1 text-red-500 text-xs">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country*</label>
                    <input 
                      {...register('country')} 
                      className={`w-full p-3 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-2 focus:ring-black focus:border-transparent`}
                      placeholder="Nigeria"
                    />
                    {errors.country && <p className="mt-1 text-red-500 text-xs">{errors.country.message}</p>}
                  </div>
                </div>
              </form>
            </div>

            
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img 
                      src={item.selectedColor?.image || ''} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.selectedColor?.name && `Color: ${item.selectedColor.name}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>₦{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                onClick={handleSubmit(processPayment)}
                className="w-full mt-6 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Complete Purchase
              </button>

              <div className="mt-4 text-xs text-gray-500">
                By completing your purchase, you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">Contact our customer support for assistance with your order.</p>
              <button className="text-sm font-medium underline hover:text-gray-800">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;