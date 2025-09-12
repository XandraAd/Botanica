import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <p className="mb-2">1234 Fashion Street, Suite 567</p>
            <p className="mb-2">New York, NY</p>
            <p className="mb-2">Email: info@fashionshop.com</p>
            <p className="mb-4">Phone: (212) 555-1234</p>
            <button className="border border-white px-4 py-2 text-sm hover:bg-white hover:text-gray-900 transition-colors">
              Get direction
            </button>
          </div>

          {/* Help & Policies */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-white transition-colors"
                >
                  Returns + Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">
                  FAO's
                </Link>
              </li>
              <li>
                <Link
                  to="/compare"
                  className="hover:text-white transition-colors"
                >
                  Compare Products
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-white transition-colors"
                >
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Useful Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/store"
                  className="hover:text-white transition-colors"
                >
                  Our Store
                </Link>
              </li>
              <li>
                <Link
                  to="/visit-store"
                  className="hover:text-white transition-colors"
                >
                  Visit Our Store
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="hover:text-white transition-colors"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Sign Up for Email
            </h3>
            <p className="mb-4">
              Sign up to get first dibs on new arrivals, sales, exclusive
              content, events and more!
            </p>
            <form className="mb-6">
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white text-gray-900 px-4 py-2 font-medium hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* Currency and Language Selector */}
            <div className="flex space-x-4 mb-6">
              <div>
                <select
                  className="bg-gray-800 border border-gray-700 text-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-white transition-colors"
                  defaultValue="ghana cedis"
                >
                  <option value="ghana cedis">GHS</option>
                  <option value="US Dollar">USD</option>
                  <option value="Euro">EUR</option>
                  <option value="Pounds">GBP</option>
                </select>
              </div>
              <div>
                <select className="bg-gray-800 border border-gray-700 text-white px-2 py-1 text-sm focus:outline-none">
                  <option>English</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© 2025 Ecomus. All Rights Reserved</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">We accept:</span>
            <div className="flex space-x-2">
              <div className="bg-white p-1 rounded-sm flex items-center justify-center h-6 w-10">
                <img
                  src="http://localhost:5000/assets/momo.jpg"
                  alt="Visa"
                  className="h-4 object-contain"
                />
              </div>

              <div className="bg-white p-1 rounded-sm flex items-center justify-center h-6 w-10">
                <img
                  src="http://localhost:5000/assets/visa.png"
                  className="h-4 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
