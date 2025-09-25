import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ name, email, password: hashedPassword });

  try {
    await newUser.save();
    const token = createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // ✅ create token and set cookie
  const token = createToken(res, user._id);

  // ✅ also send token back in JSON
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isAdmin: user.isAdmin,
    token,
    message: "Login successful",
  });
});

export const logoutCurrentUser = asyncHandler(async (req, res) => {
  // Clear cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  // Tell frontend to clear local token as well
  res
    .status(200)
    .json({ message: "Logged out successfully, clear client token" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});


export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update basic info
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  // Update password if provided
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  // Update avatar URL directly
  if (req.body.avatar) {
    user.avatar = req.body.avatar; // must be a valid Cloudinary URL
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    isAdmin: updatedUser.isAdmin,
    message: "Profile updated successfully",
  });
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed successfully" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name; // Fixed typo: req.body.ame -> req.body.name
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      message: "User updated successfully",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get logged-in user's addresses
export const getUserAddresses = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user.addresses || []);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc Add new address
export const addUserAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const address = req.body;
    user.addresses.push(address);
    await user.save();
    res.status(201).json(user.addresses);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc Update address
export const updateUserAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const address = user.addresses.id(req.params.id);
    if (address) {
      Object.assign(address, req.body);
      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404);
      throw new Error("Address not found");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc Delete address
export const deleteUserAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );
    await user.save();
    res.json(user.addresses);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

//upload avatar
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "avatars",
  });

  res.status(200).json({ url: result.secure_url });
});
