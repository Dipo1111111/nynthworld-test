import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, image, name, price }) => {
  return (
    <div className="max-w-sm group product-card"> {/* Added product-card class */}
      <Link to={`/products/${id}`} className="block">
        <div className="relative bg-white overflow-hidden">
          <div className="relative overflow-hidden mb-4">
            <img
              src={image}
              alt={name}
              className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm uppercase tracking-wide text-black group-hover:underline transition-all duration-300 ease-in-out">
              {name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-black">
                {price}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;