import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="bg-white overflow-hidden">
        {/* Contact Info Bar */}
        <div className="bg-black text-white text-center py-2 text-xs sm:text-sm">
          WELCOME TO NYNTH WORLD
        </div>

        {/* Main Header - Not Fixed */}
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between ">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center logo">
              <img
                src="/assets/logo_black.png"
                alt="Nynth World Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-medium text-gray-700">
              <Link to="/products" className="hover:text-black transition-colors nav-item">Caps</Link>
              <Link to="/products" className="hover:text-black transition-colors nav-item">Tops</Link>
            </nav>

            {/* Cart Icon */}
            <div className="relative">
              {/* Mobile Cart Button (opens sidebar) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="md:hidden"
              >
                <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors" />
              </button>

              {/* Desktop Cart Link */}
              <Link
                to="/cart"
                className="hidden md:block"
              >
                <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors" />
              </Link>

              {/* Cart count badge */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 text-sm font-medium text-gray-700">
                <Link to="/products" className="hover:text-black transition-colors nav-item">Caps</Link>
                <Link to="/products" className="hover:text-black transition-colors nav-item">Tops</Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Secondary Navigation - Fixed on Scroll */}
      <div className={`bg-gray-100 py-3 sm:py-4 w-full ${isScrolled ? 'fixed top-0 left-0 z-50 transition-transform duration-300' : ''}`}>
        <div className="container mx-auto px-4">
          <nav className="flex justify-center space-x-4 sm:space-x-8 lg:space-x-12 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide sm:mr-12 sm:ml-12 lg:mr-24 lg:ml-24">
            <Link to="/products" className="hover:text-black transition-colors nav-item">Caps</Link>
            <Link to="/products" className="hover:text-black transition-colors nav-item">Tops</Link>
          </nav>
        </div>
      </div>

      {/* Spacer when navbar is fixed */}
      {isScrolled && <div className="h-12 sm:h-14"></div>}
    </>
  );
};

export default Navbar;