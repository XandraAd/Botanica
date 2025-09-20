import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "GHS" },
  reference: { type: String, unique: true, required: true },
  status: { type: String, default: "unpaid" }, 
  cartItems: { type: Array, default: [] },
  paidAt: Date,
  paystackResponse: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Invoice", invoiceSchema);
