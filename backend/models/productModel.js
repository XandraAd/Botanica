import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },

  // ✅ must always have at least 1 image
  images: [{ type: String, required: true }],

  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

  sizes: [{ type: String }],
  colors: [{ type: String }],

  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },

  collectionImage: { type: String, default: "" }, 
  arrivalImage: { type: String, default: "" },

  sold: { type: Number, default: 0 },

collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
    // ✅ New fields
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },


 
}, 
{
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;
