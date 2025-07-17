import { usePaystackPayment } from 'react-paystack';

const PaystackButton = ({ email, amount, metadata, onSuccess, onClose }) => {
  const config = {
    reference: `ORDER-${Date.now()}`,
    email,
    amount: amount * 100, // Convert to kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // From .env
    metadata, // { products, customer }
  };

  const initializePayment = usePaystackPayment(config);
  
  return (
    <button
      onClick={() => initializePayment(onSuccess, onClose)}
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      Proceed to Payment
    </button>
  );
};

export default PaystackButton;