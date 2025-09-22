import React from "react";
import { FaHeart, FaRegEye, FaStar } from "react-icons/fa";
import { IoMdShuffle } from "react-icons/io";
import { FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCartApi } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { BASE_URL } from "../store/constants";

const ProductCard = ({ product, variant, onView }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  if (!product) return null;

  // ✅ Add to cart handler (backend only)
  const handleAddToCart = () => {
    if (!userInfo?._id) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    const size = product.size || "standard"; // fallback
    const item = {
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      size,
      quantity: 1,
    };

    dispatch(addToCartApi({ userId: userInfo._id, item }))
      .unwrap()
      .then(() => toast.success("Added to cart!"))
      .catch((error) => {
        console.error("Failed to add to cart:", error);
        toast.error("Failed to add to cart. Try again.");
      });
  };

  // ✅ Wishlist handler (still localStorage)
  const handleAddToWishList = () => {
    const wishlistItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      addedAt: new Date().toISOString(),
    };

    try {
      const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const alreadyExists = existingWishlist.some((item) => item._id === product._id);

      if (alreadyExists) {
        toast.info("Item already in wishlist");
        return;
      }

      const newWishlist = [...existingWishlist, wishlistItem];
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  // ✅ Image resolver - fixed to handle all cases properly
  const getImageUrl = (product) => {
    if (!product) return "/fallback-image.jpg";
    
    // Handle case where image might already be a full URL
    if (product.arrivalImage && product.arrivalImage.startsWith('http')) {
      return product.arrivalImage;
    }
    if (product.collectionImage && product.collectionImage.startsWith('http')) {
      return product.collectionImage;
    }
    if (product.images?.length > 0 && product.images[0].startsWith('http')) {
      return product.images[0];
    }
    
    // Handle relative paths by prepending BASE_URL
    const base = BASE_URL || '';
    if (product.arrivalImage) return `${base}${product.arrivalImage}`;
    if (product.collectionImage) return `${base}${product.collectionImage}`;
    if (product.images?.length > 0) return `${base}${product.images[0]}`;
    
    return "/fallback-image.jpg";
  };

// Calculate rating & numReviews from reviews array
const numReviews = product.reviews?.length || 0;
const rating =
  numReviews > 0
    ? product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / numReviews
    : 0;


  return (
    <div
      className={`group rounded-xl overflow-hidden transition-transform duration-300 relative
      ${variant === "newest" ? "hover:shadow-green-200 hover:scale-105" : ""}
      ${variant === "plants" ? "hover:shadow-lg hover:-translate-y-2" : ""}
      ${variant === "collections" ? "hover:border-green-400" : ""}`}
    >
      {/* Image wrapper with overlay */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getImageUrl(product)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Cart */}
          <button
            onClick={handleAddToCart}
            className="p-2 bg-green-600 rounded-full shadow-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100"
            aria-label="Add to cart"
          >
            <FiShoppingBag size={18} className="text-white" />
          </button>

          {/* Wishlist */}
          <button
            onClick={handleAddToWishList}
            className="p-2 bg-white rounded-full shadow-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200"
            aria-label="Add to wishlist"
          >
            <FaHeart size={18} className="text-gray-700" />
          </button>

          {/* Compare */}
          <button
            className="p-2 bg-white rounded-full shadow-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-300"
            aria-label="Compare product"
          >
            <IoMdShuffle size={18} className="text-gray-700" />
          </button>

          {/* Details */}
          <button
            onClick={() => onView(product)}
            className="p-2 bg-white rounded-full shadow-lg transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-400"
            aria-label="View product details"
          >
            <FaRegEye size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div
        onClick={() => onView(product)}
        className="p-4 flex flex-col gap-2 cursor-pointer"
      >
        <h3 className="font-semibold text-base sm:text-lg truncate">
          {product.name}
        </h3>

        {product.collection && (
          <p className="text-gray-600 text-sm">{product.collection}</p>
        )}

        {/* Rating summary - fixed logic */}
        {rating > 0 && (
         <div className="flex items-center text-sm">
  {Array.from({ length: 5 }).map((_, index) => (
    <FaStar
      key={index}
      size={14}
      className={
        index < Math.round(rating)
          ? "text-yellow-500"
          : "text-gray-300"
      }
    />
  ))}
  <span className="ml-2 text-gray-600 text-xs">
    {numReviews > 0 ? `(${numReviews})` : "No reviews"}
  </span>
</div>

        )}

        {/* Price */}
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-lg">
            ${product.price ? product.price.toFixed(2) : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;