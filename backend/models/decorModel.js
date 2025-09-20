import mongoose from "mongoose";

const decorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, 
  },
  { timestamps: true }
);

const Decor = mongoose.model("Decor", decorSchema);
export default Decor;
