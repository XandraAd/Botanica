import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { FaCartArrowDown, FaBars, FaTimes, FaUser, FaSignOutAlt, FaSearch, FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../slices/authSlice.js";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Cart total items
  const cartItemsCount = cart.cartItems.reduce((total, item) => total + item.quantity, 0);

  // User initials
  const getUserInitials = () => {
    if (!auth.userInfo?.name) return "U";
    return auth.userInfo.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('userInfo');
      window.location.href = '/';
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close user menu with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Detect scroll for navbar style change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      {/* Top announcement bar with continuous CSS scroll */}
      <div className="bg-green-900 text-center py-2 text-xs text-white uppercase overflow-hidden">
        <div className="animate-scroll inline-block whitespace-nowrap">
          <span className="mx-8">🌿 Bring nature home: Fresh plant arrival</span>
          <span className="mx-8">✨ Limited time: Green your space with style!</span>
          <span className="mx-8">🌱 New growth, new beginnings: Plants that inspire</span>
          <span className="mx-8">🏷️ Free shipping on orders over $50</span>
          <span className="mx-8">💚 Join our plant lover community</span>
          {/* Duplicate for smooth loop */}
          <span className="mx-8">🌿 Bring nature home: Fresh plant arrival</span>
          <span className="mx-8">✨ Limited time: Green your space with style!</span>
          <span className="mx-8">🌱 New growth, new beginnings: Plants that inspire</span>
          <span className="mx-8">🏷️ Free shipping on orders over $50</span>
          <span className="mx-8">💚 Join our plant lover community</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/new-arrivals" className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase tracking-wider">New Arrivals</Link>
            <Link to="/collections" className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase tracking-wider">Collections</Link>
            <Link to="/plants" className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase tracking-wider">Plants</Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>

          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 text-center"
            onClick={closeMenu}
          >
            <h1 className="font-serif text-2xl font-bold text-gray-900">BOTANICA</h1>
          </Link>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-gray-900">
              <FaSearch className="text-lg" />
            </button>

            <Link
              to="/wishlist"
              className="p-2 text-gray-700 hover:text-gray-900"
              onClick={closeMenu}
            >
              <FaHeart className="text-lg" />
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-gray-900"
              onClick={closeMenu}
            >
              <FaCartArrowDown className="text-lg" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Section */}
            {auth.userInfo ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center justify-center w-9 h-9 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 focus:outline-none"
                  aria-label="User menu"
                >
                  {auth.userInfo.avatar ? (
                    <img
                      src={auth.userInfo.avatar}
                      alt={auth.userInfo.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">{getUserInitials()}</span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{auth.userInfo.name}</p>
                      <p className="text-sm text-gray-500 truncate">{auth.userInfo.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
                      <FaUser className="inline mr-2" /> Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
                      My Orders
                    </Link>
                    {auth.userInfo.isAdmin && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium text-sm">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Secondary navigation */}
        <div className="hidden lg:flex justify-center border-t border-gray-200 pt-4 pb-3">
          <div className="flex space-x-10">
            <Link to="/indoor-plants" className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase tracking-wider">Indoor Plants</Link>
            <Link to="/outdoor-plants" className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase tracking-wider">Outdoor Plants</Link>
            <Link to="/plant-accessories" className="text-gray-700 hover:text-gray-900 font-medium text-sm uppercase tracking-wider">Accessories</Link>
            <Link to="/sale" className="text-red-600 hover:text-red-700 font-medium text-sm uppercase tracking-wider">Sale</Link>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/new-arrivals" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">New Arrivals</Link>
            <Link to="/collections" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">Collections</Link>
            <Link to="/plants" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">Plants</Link>
            <Link to="/indoor-plants" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">Indoor Plants</Link>
            <Link to="/outdoor-plants" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">Outdoor Plants</Link>
            <Link to="/plant-accessories" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">Accessories</Link>
            <Link to="/sale" onClick={closeMenu} className="block px-3 py-2 text-red-600 hover:bg-gray-50 rounded-md font-medium">Sale</Link>

            {/* Mobile user menu */}
            {auth.userInfo ? (
              <>
                <div className="px-3 py-2 border-t border-gray-100 mt-2">
                  <p className="text-sm font-medium text-gray-900">{auth.userInfo.name}</p>
                  <p className="text-sm text-gray-500">{auth.userInfo.email}</p>
                </div>
                <Link to="/profile" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  <FaUser className="inline mr-2" /> Profile
                </Link>
                <Link to="/orders" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  My Orders
                </Link>
                {auth.userInfo.isAdmin && (
                  <Link to="/admin/dashboard" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 rounded-md"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md border-t border-gray-100 mt-2 pt-3">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
