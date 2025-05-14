import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  });
};

//Login and existing user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

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

// Get current user profile (requires auth)
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// Upload or update profile photo
export const updateProfilePhoto = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.profilePhoto = req.file.path;
  await user.save();
  res.json({ message: "Profile photo updated", url: user.profilePhoto });
};