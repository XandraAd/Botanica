import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const ref = new URLSearchParams(location.search).get("reference");

    if (ref) {
      // 🚀 Instant redirect to OrderConfirmation with reference
      navigate(`/order-confirmation?reference=${ref}`, { replace: true });
    } else {
      // fallback if no reference
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Redirecting...</h1>
        <p className="text-gray-600">
          Please wait while we confirm your payment.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
