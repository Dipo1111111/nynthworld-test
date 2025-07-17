import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

const Products = () => {
  const [loading, setLoading] = useState(true);

  // Sample products data - you can replace this with your actual data
  const products = [
    {
      id: 'truqha-9',
      image: "/public/assets/products/truqha_blue.png",
      name: "TRUQHA 9",
      price: "₦6999.99 NGN"
    },
    // Add more products here
  ];

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
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-12 text-left uppercase tracking-wide">
          Our Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;