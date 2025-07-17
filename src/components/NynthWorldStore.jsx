import React from 'react';
import ProductCard from './ProductCard';
import Footer from './Footer';

const NynthWorldStore = () => {
  return (
    <div className="Home">
      {/* What's New Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12 text-left uppercase tracking-wide">
            WHAT'S NEW
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProductCard
              id="truqha-9"
              image="/public/assets/products/truqha_blue.png"
              name="TRUQHA 9 COLLECTION"
              price="₦6999.99 NGN"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NynthWorldStore;