import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get("reference");
    const orderId = params.get("orderId");

    if (orderId) {
      // COD or Paystack with orderId
      navigate(`/order-confirmation?orderId=${orderId}${reference ? `&reference=${reference}` : ""}`, { replace: true });
    } else if (reference) {
      // Fallback for Paystack reference only
      navigate(`/order-confirmation?reference=${reference}`, { replace: true });
    } else {
      // No info, go home
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we confirm your payment.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
