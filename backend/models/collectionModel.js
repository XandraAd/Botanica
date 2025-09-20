// models/collectionModel.js
import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
      previewImage: { // ✅ add this
      type: String,
      default: null,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // links to Product model
      },
    ],
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 Middleware: update count automatically
collectionSchema.pre("save", function (next) {
  this.count = this.products.length;
  next();
});

collectionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.products) {
    update.count = update.products.length;
  }
  next();
});

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;
