// routes/cartRoutes.js
import express from 'express';
import Cart from '../models/CartModel.js';

const router = express.Router();

// ✅ Helper: format cart items so frontend always gets clean objects
const formatCartItems = (cart) => {
  return cart.cartItems.map((item) => ({
    _id: item._id._id || item._id, // populated product OR raw id
    name: item._id.name,
    price: item._id.price,
    images: item._id.images,
    size: item.size,
    quantity: item.quantity,
  }));
};


// ✅ Get cart by userId with product details
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('cartItems._id', 'name price images');

    if (!cart) return res.json({ cartItems: [] });

    res.json({ cartItems: formatCartItems(cart) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
});


// ✅ Add item to cart
router.post('/:userId', async (req, res) => {
  try {
    const { _id, size = "standard", quantity = 1 } = req.body;

    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, cartItems: [] });
    }

    const existingItem = cart.cartItems.find(
      (item) => (item._id._id ? item._id._id.toString() : item._id.toString()) === _id && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity; // ✅ increment instead of overwrite
    } else {
      cart.cartItems.push({ _id, size, quantity });
    }

    await cart.save();
    await cart.populate('cartItems._id', 'name price images');

    res.json({ cartItems: formatCartItems(cart) });
  } catch (error) {
    console.error("Error in POST /api/cart/:userId:", error);
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
});


// ✅ Update item quantity
router.put('/:userId', async (req, res) => {
  const { _id, size, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('cartItems._id', 'name price images');

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.cartItems.find(
      (item) => item._id._id.toString() === _id && item.size === size
    );

    if (item) {
      item.quantity = Math.max(1, quantity); // ✅ prevent going below 1
    }

    await cart.save();
    await cart.populate('cartItems._id', 'name price images');

    res.json({ cartItems: formatCartItems(cart) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error });
  }
});

// ✅ Remove item from cart
router.delete('/:userId', async (req, res) => {
  try {
    // Support both body and query fallback
    const { _id, size } = req.body || req.query;

    if (!_id) {
      return res.status(400).json({ message: "Missing product _id" });
    }

    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Correctly compare populated vs raw IDs
    cart.cartItems = cart.cartItems.filter(
      (item) =>
        !(
          (item._id._id ? item._id._id.toString() : item._id.toString()) === _id &&
          item.size === size
        )
    );

    await cart.save();
    await cart.populate('cartItems._id', 'name price images');

    return res.json({ cartItems: formatCartItems(cart) });
  } catch (error) {
    console.error("❌ Error in DELETE /api/cart/:userId:", error);
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
});

// Backend route for clearing cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find the user's cart and clear it
    let cart = await Cart.findOne({ user: userId });
    
    if (cart) {
      cart.cartItems = []; // Clear all items
      await cart.save();
      res.json({ message: 'Cart cleared successfully', cartItems: [] });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ✅ Merge guest cart into user cart
router.post('/:userId/merge', async (req, res) => {
  const { guestCartItems } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = new Cart({ userId: req.params.userId, cartItems: [] });
    }

    guestCartItems.forEach((guestItem) => {
      const existingItem = cart.cartItems.find(
        (item) =>
          item._id.toString() === guestItem._id &&
          item.size === guestItem.size
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        cart.cartItems.push(guestItem);
      }
    });

    await cart.save();
    await cart.populate('cartItems._id', 'name price images');

    res.json({ cartItems: formatCartItems(cart) });
  } catch (error) {
    res.status(500).json({ message: 'Error merging cart', error });
  }
});



router.get("/verify/:reference", async (req, res) => {
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

      const order = await Order.findById(orderId);
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
      await Cart.findOneAndUpdate(
        { user: order.user },
        { $set: { cartItems: [] } }
      );

      return res.json({
        success: true,
        message: "Payment verified, order updated & cart cleared",
        order,
         cartItems: clearedCart.cartItems, 
      });
    } else {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }
  } catch (err) {
    console.error("Verify error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});




export default router;
