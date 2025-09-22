import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCT_URL, BASE_URL } from "../../store/constants";
import { FiShoppingCart } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { addToCartApi } from "../../slices/cartSlice";
import { toast } from "react-toastify";

const SingleProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${PRODUCT_URL}/${id}`);
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images?.[0] ? (data.images[0].startsWith("http") ? data.images[0] : `${BASE_URL}${data.images[0]}`) : "");
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


// Inside handleAddToCart
const handleAddToCart = () => {
  if (!userInfo?._id) {
    toast.info("Please log in to add items to your cart");
    return;
  }

  const item = {
    _id: product._id,
    name: product.name,
    price: product.price,
    images: product.images,
    quantity: 1,
  };

  dispatch(addToCartApi({ userId: userInfo._id, item }))
    .unwrap()
    .then(() => toast.success("Added to cart!"))
    .catch((err) => {
      console.error("Cart API error:", err);
      toast.error("Failed to add to cart. Please try again.");
    });
};

// Buy Now
const handleBuyNow = () => {
  handleAddToCart();
  navigate("/checkout");
};


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        Product not found.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Images */}
      <div className="md:w-1/2 flex flex-col gap-4">
        {mainImage && (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-96 md:h-[500px] object-cover rounded-lg"
          />
        )}
        <div className="flex gap-2 mt-2">
          {product.images?.map((img, idx) => {
            const src = img.startsWith("http") ? img : `${BASE_URL}${img}`;
            return (
              <img
                key={idx}
                src={src}
                alt={`${product.name} ${idx + 1}`}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-gray-300 hover:border-green-600"
                onClick={() => setMainImage(src)}
              />
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-6">${product.price}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
          >
            <FiShoppingCart className="text-lg" />
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
