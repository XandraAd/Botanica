import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import AddressForm from './Orders/AddressForm';

const CheckoutPage = () => {
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    CompanyName: '',
    Country: 'United States (US)',
    StreetAddress: '',
    Apartment: '',
    City: '',
    State: '',
    ZipCode: '',
    Email: '',
    Phone: '',
    paymentMethod: '',
    shipToDifferent: false
  });
  
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!userInfo) {
      setError('Please log in to place an order.');
    } else {
      setError('');
    }
  }, [userInfo]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'FirstName', 'LastName', 'StreetAddress', 
      'City', 'ZipCode', 'Email', 'Phone'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (!formData.paymentMethod) {
      setError("Please select a payment method.");
      return false;
    }
    
    return true;
  };

 const handlePlaceOrder = async () => {
  if (!userInfo) {
    setError("Please log in to place an order.");
    navigate("/login");
    return;
  }

  if (cartItems.length === 0) {
    setError("Your cart is empty.");
    return;
  }

  // Validate form before submitting
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  setError("");

  try {
    if (formData.paymentMethod === "paystack") {
      // ✅ Initialize Paystack
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/initialize",
        {
          email: formData.Email,
          amount: total,
          reference: `ref-${Date.now()}`,
          orderItems: cartItems.map((item) => ({
            _id: item._id,
            name: item.name,
            qty: item.quantity,
            image: item.images[0],
            price: item.price,
            size: item.size,
                product: item._id,
          })),
          shippingAddress: {
            address: formData.StreetAddress,
            city: formData.City,
            postalCode: formData.ZipCode,
            country: formData.Country,
            firstName: formData.FirstName,
            lastName: formData.LastName,
            email: formData.Email,
            phone: formData.Phone,
            state: formData.State,
          },
        },
        { withCredentials: true }
      );

      // ✅ Redirect to Paystack
      window.location.href = data.authUrl;
    } else {
      // ✅ Normal order creation (Card / COD)
      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        
        {
          orderItems: cartItems.map((item) => ({
            _id: item._id,
            name: item.name,
            qty: item.quantity,
            image: item.images[0],
            price: item.price,
            size: item.size,
            product: item._id,
            
          })),
          
          shippingAddress: {
            address: formData.StreetAddress,
            city: formData.City,
            postalCode: formData.ZipCode,
            country: formData.Country,
            firstName: formData.FirstName,
            lastName: formData.LastName,
            email: formData.Email,
            phone: formData.Phone,
            state: formData.State,
          },
          paymentMethod: formData.paymentMethod,
          itemsPrice: subtotal,
          shippingPrice: shipping,
          totalPrice: total,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
console.log("cartItems before sending order:", cartItems);

      alert("Order placed successfully!");
      navigate("/order-confirmation", { state: { order: data } });
    }
  } catch (err) {
    console.error("Order error:", err.response?.data || err.message);

    if (err.response?.status === 401) {
      setError("Your session has expired. Please log in again.");
      setTimeout(() => navigate("/login"), 3000);
    } else if (err.response?.data?.error) {
      const errorMessage = err.response.data.error;
      if (errorMessage.includes("validation failed")) {
        setError("Please fill in all required shipping information.");
      } else {
        setError(errorMessage);
      }
    } else if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("Failed to place order. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  const handleCouponSubmit = (e) => {
    e.preventDefault();
    alert(`Coupon code applied: ${couponCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6 flex items-center">
            <FaExclamationTriangle className="text-red-400 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Billing Details */}
          <div className="w-full lg:w-7/12">
            {/* Coupon Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => setHasCoupon(!hasCoupon)}
              >
                <span className="text-green-600 mr-2">
                  <FaCheckCircle />
                </span>
                <h2 className="text-lg font-medium text-gray-900">
                  Have a coupon? Enter your code
                </h2>
              </div>
              
              {hasCoupon && (
                <form onSubmit={handleCouponSubmit} className="mt-4 flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>
            
            {/* Billing Details Form */}
            <AddressForm formData={formData} onChange={handleInputChange} />
            
            {/* Ship to a different address */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="shipToDifferent"
                  checked={formData.shipToDifferent}
                  onChange={handleInputChange}
                  className="text-green-600"
                />
                <span>Ship to a different address?</span>
              </label>

              {formData.shipToDifferent && (
                <div className="mt-4">
                  <AddressForm
                    formData={formData}
                    onChange={handleInputChange}
                    prefix="shipping"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your order</h2>

              {subtotal >= 100 && (
                <div className="bg-green-50 p-4 rounded-md mb-6">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">
                      <FaCheckCircle />
                    </span>
                    <p className="text-green-800 font-medium">
                      Congratulations! You have got free shipping!
                    </p>
                  </div>
                </div>
              )}

              {/* Table Header */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-center font-medium text-gray-900">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>
              </div>

              {/* Cart Items */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={`${item._id}-${item.size}`}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        {item.name} {item.size && `- ${item.size}`} ×{" "}
                        {item.quantity}
                      </span>
                      <span>
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}

                {/* Subtotal */}
                <div className="flex justify-between items-center font-medium text-gray-900 pt-2 border-t">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Shipping</h3>
                <p className="text-gray-700">
                  {shipping === 0 ? 'Free shipping' : `$${shipping.toFixed(2)}`}
                </p>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center font-bold text-lg text-gray-900 mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>

                <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleInputChange}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span>Credit/Debit Card</span>
                </label>

                <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={formData.paymentMethod === "paystack"}
                    onChange={handleInputChange}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span>Paystack</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              <button 
                onClick={handlePlaceOrder} 
                disabled={!userInfo || loading || cartItems.length === 0}
                className={`w-full py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-green-500 mt-4 ${
                  !userInfo || loading || cartItems.length === 0
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              
              {!userInfo && (
                <p className="text-red-500 text-sm mt-2">
                  Please log in to place an order.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;