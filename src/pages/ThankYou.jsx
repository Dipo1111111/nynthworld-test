// ThankYou.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ThankYou = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Get reference from either state or URL
  const reference = state?.reference || new URLSearchParams(window.location.search).get('reference');
  const orderId = state?.orderId || new URLSearchParams(window.location.search).get('orderId');

  // Fallback if no reference
  useEffect(() => {
    if (!reference) {
      navigate('/');
    }
  }, [reference, navigate]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="mb-6">Your payment was successful. We've received your order and it's being processed.</p>
        
        {reference && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-medium">Payment Reference:</p>
            <p className="text-sm font-mono">{reference}</p>
          </div>
        )}
        
        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="font-medium">Order Number:</p>
            <p className="text-sm font-mono">{orderId}</p>
          </div>
        )}

        <p className="mt-6 text-sm text-gray-600">
          A confirmation has been sent to your email. If you have any questions, please contact our support team.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="mt-8 bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ThankYou;