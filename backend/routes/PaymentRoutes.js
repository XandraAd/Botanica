import express from "express";
import axios from "axios";
import Order from "../models/orderModel.js";
import sendEmail from "../utils/sendEmail.js";
import { protect } from "../middlewares/authMiddleware.js";
import Cart from "../models/CartModel.js";
import Product from "../models/productModel.js"; // ✅ added missing import

const router = express.Router();

// ✅ Use env vars for URLs
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const CLIENT_URL= process.env.CLIENT_URL || "http://localhost:5173";

/** Health check */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    paystackConfigured: !!process.env.PAYSTACK_SECRET_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Convert USD to GHS safely
const convertUsdToGhs = async (amountUsd) => {
  try {
    const { data } = await axios.get(
      `https://api.exchangerate.host/convert?from=USD&to=GHS&amount=${amountUsd}`
    );
    if (!data || typeof data.result !== "number") {
      throw new Error("Invalid conversion response");
    }
    return data.result;
  } catch (err) {
    console.error("Currency conversion error:", err.message);
    // Fallback exchange rate if API fails
    return Number(amountUsd) * 13;
  }
};

// Initialize Paystack payment
router.post("/initialize", protect, async (req, res) => {
  const { email, amount, reference, orderItems, shippingAddress } = req.body;

  try {
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount sent from frontend",
      });
    }

    // Convert USD to GHS
    let amountInGhs = await convertUsdToGhs(amount);
    amountInGhs = Number(amountInGhs);

    if (isNaN(amountInGhs) || amountInGhs <= 0) {
      amountInGhs = 1; // Ensure at least 1 GHS
    }

    // Paystack expects integer amount in kobo
    const paystackAmount = Math.max(Math.round(amountInGhs * 100), 1);

    // Create order in DB
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: "Paystack",
      itemsPrice: amount,
      totalPrice: amount,
      isPaid: false,
    });

   // Initialize Paystack transaction
const paystackRes = await axios.post(
  "https://api.paystack.co/transaction/initialize",
  {
    email,
    amount: paystackAmount,
    currency: "GHS",
    reference,
    callback_url: `${process.env.CLIENT_URL}/api/payment/callback`, 
    metadata: { orderId: order._id.toString(), userId: req.user._id },
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  }
);

res.json(paystackRes.data);


    res.json({
      success: true,
      authUrl: paystackRes.data.data.authorization_url,
      reference,
      orderId: order._id,
      amountInGhs,
    });
  } catch (err) {
    console.error("Order error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to initialize Paystack payment",
      details: err.response?.data || err.message,
    });
  }
});

router.get("/verify/:reference", async (req, res) => {
  const { reference } = req.params;

  try {
    // Verify payment with Paystack
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    const verification = paystackRes.data;

    if (verification.status && verification.data.status === "success") {
      const payData = verification.data;
      const orderId = payData.metadata?.orderId;
      const userIdFromPaystack = payData.metadata?.userId;

      if (!orderId) {
        return res.status(400).json({ success: false, error: "No orderId found in Paystack metadata" });
      }

      // Load the order
      const order = await Order.findById(orderId).populate("user", "name email");
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found for orderId: " + orderId });
      }

      // Extract userId safely
      const orderUserId = order.user?._id ? order.user._id.toString() : order.user.toString();

      // Security check: metadata userId must match order.user
      if (userIdFromPaystack && orderUserId !== userIdFromPaystack) {
        return res.status(403).json({ success: false, error: "Not authorized for this order" });
      }

      // ✅ Update order
      order.isPaid = true;
      order.paidAt = new Date(payData.paid_at || Date.now());
      order.paymentResult = {
        id: payData.id,
        status: payData.status,
        update_time: payData.transaction_date || new Date().toISOString(),
        email_address: payData.customer?.email || order.user.email,
      };
      await order.save();

      // ✅ Clear cart
      try {
        await Cart.findOneAndUpdate({ user: orderUserId }, { $set: { cartItems: [] } });
        console.log("Cart cleared successfully for user:", orderUserId);
      } catch (cartError) {
        console.error("Error clearing cart:", cartError.message);
      }

      // ✅ Send confirmation email
      try {
        const itemsList = order.orderItems.map(
          (item) => `<li>${item.qty} × ${item.name} — $${(item.qty * item.price).toFixed(2)}</li>`
        ).join("");

        const emailHtml = `
          <h2>Thank you for your order, ${order.user.name} 🌱</h2>
          <p>Your payment has been confirmed.</p>
          <h3>Order Summary</h3>
          <ul>${itemsList}</ul>
          <p><strong>Total Paid:</strong> $${order.totalPrice.toFixed(2)}</p>
          <p>We’ll notify you when your items are shipped.</p>
        `;

        await sendEmail({
          to: order.user.email,
          subject: "Order Confirmation - Botanica",
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError.message);
      }

      return res.json({
        success: true,
        message: "Payment verified, order updated, cart cleared",
        order,
      });
    }

    // Not successful
    return res.status(400).json({
      success: false,
      message: "Payment not successful",
      paystackStatus: verification.data?.status,
    });
  } catch (err) {
    console.error("Payment verification error:", err.response?.data || err.message);

    if (err.response?.status === 404) {
      return res.status(404).json({ success: false, error: "Payment reference not found" });
    }
    if (err.response?.status === 401) {
      return res.status(401).json({ success: false, error: "Invalid Paystack API key" });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error during payment verification",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

/** Get Order Status */
router.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/callback", async (req, res) => {
  const { reference } = req.query;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173"; // fallback for dev

  try {
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (paystackRes.data.data.status === "success") {
      // ✅ update order
      const orderId = paystackRes.data.data.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        await order.save();
      }

      // ✅ redirect back to frontend with status
      return res.redirect(
        `${clientUrl}/payment-success?reference=${reference}&status=success`
      );
    } else {
      return res.redirect(
        `${clientUrl}/payment-failed?reference=${reference}&status=failed`
      );
    }
  } catch (err) {
    console.error("Callback error:", err.message);
    return res.redirect(
      `${clientUrl}/payment-failed?reference=${reference}&status=error`
    );
  }
});


// routes/products.js
router.post("/:id/review", protect, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) return res.status(400).json({ message: "Product already reviewed" });

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  await product.save();
  res.status(201).json({ message: "Review added" });
});

export default router;
