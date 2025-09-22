import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = Number((itemsPrice * taxRate).toFixed(2));

  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice,
    totalPrice,
  };
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );

    if (!matchingItemFromDB) {
      res.status(404);
      throw new Error(`Product not found: ${itemFromClient._id}`);
    }

    return {
      ...itemFromClient,
      product: itemFromClient._id,
      price: matchingItemFromDB.price,
      _id: undefined, // prevent duplicate _id
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calcPrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id username");
  res.json(orders);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "user",
    "name email"
  );

  const ordersWithISO = orders.map((order) => {
    const o = order.toObject();
    o.createdAt = order.createdAt.toISOString();
    o.updatedAt = order.updatedAt.toISOString();
    if (order.paidAt) o.paidAt = order.paidAt.toISOString();
    if (order.deliveredAt) o.deliveredAt = order.deliveredAt.toISOString();
    return o;
  });

  res.json(ordersWithISO);
});

// @desc    Count total orders
// @route   GET /api/orders/total-orders
// @access  Public/Admin
export const countTotalOrders = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  res.json({ totalOrders });
});

// @desc    Calculate total sales
// @route   GET /api/orders/total-sales
// @access  Public/Admin
export const calculateTotalSales = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice),
    0
  );
  res.json({ totalSales });
});

// @desc    Calculate sales by date
// @route   GET /api/orders/total-sales-by-date
// @access  Public/Admin
export const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
  const salesByDate = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
        },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  res.json(salesByDate);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const findOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const orderObj = order.toObject();
  orderObj.createdAt = order.createdAt.toISOString();
  orderObj.updatedAt = order.updatedAt.toISOString();
  if (order.paidAt) orderObj.paidAt = order.paidAt.toISOString();
  if (order.deliveredAt) orderObj.deliveredAt = order.deliveredAt.toISOString();

  res.json(orderObj);
});


// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
});

// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Admin
export const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
