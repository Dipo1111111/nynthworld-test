import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../hooks/useCart';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);

  // Product data - would normally come from API
  const [product] = useState({
    id: 'truqha-9',
    name: 'TRUQHA 9',
    description: 'A minimalist cap designed for urban explorers. Featuring premium materials and our signature TRUQHA embroidery.',
    price: 6999.99,
    priceDisplay: '₦6,999.99 NGN',
    colors: [
      { id: 'black', name: 'Black', image: '/assets/products/truqha_black.png' },
      { id: 'white', name: 'White', image: '/assets/products/truqha_blue.png' },
      { id: 'blue', name: 'Blue', image: '/assets/products/truqha_blue.png' },
      { id: 'red', name: 'Red', image: '/assets/products/truqha_red.png' },
    ],
    features: [
      '100% Premium Cotton Twill',
      'Structured, medium profile',
      'Adjustable strapback closure',
      'Embroidered TRUQHA logo',
      'One size fits most'
    ],
  });

  useEffect(() => {
    if (!id) {
      navigate('/products');
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [id, navigate]);

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  // Get current color details
  const currentColor = product.colors.find(color => color.id === selectedColor);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedColor: currentColor,
      quantity: quantity, // Make sure this is the current quantity
      totalPrice: product.price * quantity
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <Navbar />

      {/* Product section */}
      <main className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Product images */}
          <div className="md:w-1/2">
            <div className="bg-gray-50 aspect-square flex items-center justify-center">
              <img
                src={currentColor.image}
                alt={`${product.name} in ${selectedColor}`}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.colors.map(color => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`aspect-square border ${selectedColor === color.id ? 'border-black' : 'border-gray-200'}`}
                >
                  <img
                    src={color.image}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl mb-6">{product.priceDisplay}</p>

            {/* Color selector */}
            <div className="mb-6">
              <h2 className="text-sm font-medium mb-2">COLOR: {currentColor.name.toUpperCase()}</h2>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-8 h-8 rounded-full border ${selectedColor === color.id ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.id === 'black' ? '#000' : color.id === 'white' ? '#fff' : color.id === 'blue' ? '#1010a1' : ' #FF0000' }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mb-8">
              <h2 className="text-sm font-medium mb-2">QUANTITY</h2>
              <div className="flex border border-gray-300 w-32">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <div className="flex-1 text-center py-2">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 mb-6 hover:bg-gray-800 transition"
            >
              ADD TO CART
            </button>

            {/* Product description */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">DESCRIPTION</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Product features */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">DETAILS</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* SKU */}
            <div className="text-sm text-gray-500">
              SKU: {product.sku}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetails;