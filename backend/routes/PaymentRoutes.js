import express from "express";
import axios from "axios";
import Order from "../models/orderModel.js";
import sendEmail from "../utils/sendEmail.js";
import { protect } from "../middlewares/authMiddleware.js";
import Cart from "../models/CartModel.js";

const router = express.Router();

/** Health check */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    paystackConfigured: !!process.env.PAYSTACK_SECRET_KEY,
    timestamp: new Date().toISOString(),
  });
});

/** Initialize Paystack Payment */
router.post("/initialize", protect, async (req, res) => {
  const { email, amount, reference, orderItems, shippingAddress } = req.body;

  try {
    const order = await Order.create({
      user: req.user._id,  // ✅ take user from token/session
      orderItems,
      shippingAddress,
      paymentMethod: "Paystack",
      itemsPrice: amount,
      totalPrice: amount,
      isPaid: false,
    });

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        currency: "GHS",
        reference,
        callback_url: "http://localhost:5000/api/payment/callback",
        metadata: { orderId: order._id.toString(), userId: req.user._id },
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    res.json({
      success: true,
      authUrl: paystackRes.data.data.authorization_url,
      reference,
      orderId: order._id,
    });
  } catch (err) {
    console.error("Init error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});



router.get("/verify/:reference",protect, async (req, res) => {
  const { reference } = req.params;

  try {
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    const verification = paystackRes.data;

    if (verification.status && verification.data.status === "success") {
      const payData = verification.data;
      const orderId = payData.metadata.orderId;

      const order = await Order.findById(orderId).populate("user", "name email");
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // ✅ Update order as paid
      order.isPaid = true;
      order.paidAt = new Date(payData.paid_at);
      order.paymentResult = {
        id: payData.id,
        status: payData.status,
        update_time: payData.transaction_date,
        email_address: payData.customer.email,
      };
      await order.save();

      // ✅ Clear user’s cart
      await Cart.findOneAndUpdate({ user: order.user._id }, { $set: { cartItems: [] } });

      // ✅ Send confirmation email
      const itemsList = order.orderItems
        .map(
          (item) =>
            `<li>${item.qty} × ${item.name} — $${(item.qty * item.price).toFixed(
              2
            )}</li>`
        )
        .join("");

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

      return res.json({
        success: true,
        message: "Payment verified, order updated, cart cleared & email sent",
        order,
      });
    } else {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }
  } catch (err) {
    console.error("Verify error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
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

  try {
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    if (paystackRes.data.data.status === "success") {
      // ✅ update order
      const orderId = paystackRes.data.data.metadata.orderId;
      const order = await Order.findById(orderId);
      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();

      // ✅ Redirect user back to frontend with status
      return res.redirect(
        `http://localhost:5173/payment-success?reference=${reference}&status=success`
      );
    } else {
      return res.redirect(
        `http://localhost:5173/payment-failed?reference=${reference}&status=failed`
      );
    }
  } catch (err) {
    console.error("Callback error:", err.message);
    return res.redirect(
      `http://localhost:5173/payment-failed?reference=${reference}&status=error`
    );
  }
});

export default router;

