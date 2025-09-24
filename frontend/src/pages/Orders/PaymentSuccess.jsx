import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearCartLocal, setCartItems } from "../../slices/cartSlice";
import { API_URL } from "../../store/constants";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reference = params.get("reference");
  const { userInfo } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // 'success', 'error', 'processing'

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("error");
        setLoading(false);
        navigate("/order-confirmation", {
          state: { message: "No payment reference found", success: false },
        });
        return;
      }

      try {
        console.log("Verifying payment with reference:", reference);

        const { data } = await axios.get(`${API_URL}/payment/verify/${reference}`, {
          withCredentials: true,
        });

        console.log("Payment verification result:", data);

        if (data.success) {
          setStatus("success");

          // Update cart from backend or clear locally
          if (data.cartItems) {
            dispatch(setCartItems(data.cartItems));
          } else {
            dispatch(clearCartLocal());
          }

          // Redirect to confirmation with order details
          navigate("/order-confirmation", {
            state: {
              order: data.order,
              message: data.message || "Payment successful!",
              success: true,
            },
          });
        } else {
          setStatus("error");
          navigate("/order-confirmation", {
            state: {
              message: data.message || "Payment verification failed",
              success: false,
            },
          });
        }
      } catch (err) {
        console.error("Verification failed - Full error:", err);
        setStatus("error");

        const errorMessage =
          err.response?.data?.message || err.response?.data?.error || err.message;

        navigate("/order-confirmation", {
          state: {
            message: `Payment verification failed: ${errorMessage}`,
            success: false,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, dispatch, navigate, userInfo]);

  let content;
  if (loading) {
    content = (
      <>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Verifying Payment</h1>
        <p className="text-gray-600">Please wait while we confirm your payment...</p>
      </>
    );
  } else if (status === "success") {
    content = (
      <>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Redirecting to order confirmation...</p>
      </>
    );
  } else {
    content = (
      <>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-600">Redirecting to order confirmation...</p>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        {content}
      </div>
    </div>
  );
};

export default PaymentSuccess;
