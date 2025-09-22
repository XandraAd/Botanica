// frontend/src/screens/Orders/SingleUserOrderPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../store/constants";
import ProductReviewForm from "../Products/ProductReviewForm";

const SingleUserOrderPage = ({ userInfo }) => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);



const fetchOrder = async () => {
  try {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.token}`, // 👈 required
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch order");
    }

    const data = await res.json();
    setOrder(data);
  } catch (err) {
    toast.error(err.message);
    console.error("Fetch order error:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
  if (order) {
    console.log("Full order object:", order);
  }
}, [order]);


  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;


const orderDate = order.paidAt || order.createdAt;
const parsedDate = orderDate ? new Date(orderDate) : null;


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Order #{order._id}</h2>
      <p className="text-sm text-gray-600 mb-6">  Date: {parsedDate ? parsedDate.toLocaleString() : "Unknown"}</p>

      {order?.orderItems?.map((item) => (
        <div key={item._id} className="border-b py-4">
          <p className="font-medium">{item.name}</p>
          <p>Quantity: {item.qty}</p>
          <p>Price: ${item.price}</p>

          {order.isDelivered && !item.reviewed && (
            <ProductReviewForm
              productId={item.product}
              userInfo={userInfo}
              onReviewAdded={fetchOrder}
            />
          )}

          {item.reviewed && item.review && (
            <div className="bg-gray-50 p-2 rounded mt-2">
              <p className="text-green-700 font-medium">
                Your Review ({item.review.rating} ⭐)
              </p>
              <p>{item.review.comment}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SingleUserOrderPage;
