import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-500 space-x-6">
          <span>© 2025, Nynth World</span>
          <Link to="/refund-policy" className="hover:text-black transition-colors">
            Refund policy
          </Link>
          <Link to="/privacy-policy" className="hover:text-black transition-colors">
            Privacy policy
          </Link>
          <Link to="/terms" className="hover:text-black transition-colors">
            Terms of service
          </Link>
          <Link to="/contact" className="hover:text-black transition-colors">
            Contact information
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;