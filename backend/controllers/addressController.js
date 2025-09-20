import asyncHandler from "express-async-handler";
import Address from "../models/addressModel.js";

// @desc Get all addresses for logged-in user
// @route GET /api/addresses
// @access Private
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.json(addresses);
});

// @desc Add a new address
// @route POST /api/addresses
// @access Private
export const addAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, street, city, country, postalCode, isDefault } = req.body;

  const address = new Address({
    user: req.user._id,
    fullName,
    phone,
    street,
    city,
    country,
    postalCode,
    isDefault: isDefault || false,
  });

  const createdAddress = await address.save();
  res.status(201).json(createdAddress);
});

// @desc Update address
// @route PUT /api/addresses/:id
// @access Private
export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  if (address.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  address.fullName = req.body.fullName || address.fullName;
  address.phone = req.body.phone || address.phone;
  address.street = req.body.street || address.street;
  address.city = req.body.city || address.city;
  address.country = req.body.country || address.country;
  address.postalCode = req.body.postalCode || address.postalCode;
  address.isDefault = req.body.isDefault ?? address.isDefault;

  const updatedAddress = await address.save();
  res.json(updatedAddress);
});

// @desc Delete address
// @route DELETE /api/addresses/:id
// @access Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  if (address.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await address.deleteOne();
  res.json({ message: "Address removed" });
});
