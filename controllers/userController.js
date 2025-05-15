import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Furniture from "../models/Furniture.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//Register a User

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  //   check if user alreardy exist
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  //Hash the password and create user
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    profilePhoto: req.file ? req.file.path : undefined,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePhoto: user.profilePhoto,
    token: generateToken(user),
  });
};

//Login and existing user
export const loginUser = async (req, res) => {
  // Support both JSON and form-urlencoded
  const email = req.body.email || (req.body && req.body["email"]);
  const password = req.body.password || (req.body && req.body["password"]);
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (user.isBlocked) return res.status(403).json({ message: "User is blocked. Contact admin." });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  });
};

// Get current user profile (requires auth) + user's uploaded furniture
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const furnitures = await Furniture.find({ owner: req.user.id })
      .populate("category")
      .sort({ createdAt: -1 });
    res.json({ user, furnitures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload or update profile photo
export const updateProfilePhoto = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.profilePhoto = req.file.path;
  await user.save();
  res.json({ message: "Profile photo updated", url: user.profilePhoto });
};

// @desc    Update user status (block/unblock or make/remove admin)
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Only update if provided in body
    if (typeof req.body.isBlocked === "boolean") {
      user.isBlocked = req.body.isBlocked;
    }
    if (typeof req.body.isAdmin === "boolean") {
      user.role = req.body.isAdmin ? "admin" : "user";
    }
    await user.save();
    res.json({ message: "User status updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};