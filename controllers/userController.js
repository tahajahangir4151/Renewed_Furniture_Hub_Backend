import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Furniture from "../models/Furniture.js";

const generateToken = (user) => {
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  console.log("Generated token:", token); // Debug log
  return token;
};

//Register a User

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      profilePhoto: req.file ? req.file.path : undefined,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//Login and existing user
export const loginUser = async (req, res) => {
  // Support both JSON and form-urlencoded
  const email = req.body.email || (req.body && req.body["email"]);
  const password = req.body.password || (req.body && req.body["password"]);
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (user.isBlocked)
    return res.status(403).json({ message: "User is blocked. Contact admin." });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  });
};

// Get current user profile (requires auth) + user's uploaded furniture
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, // Exclude password field
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const furnitures = await Furniture.findAll({
      where: { ownerId: req.user.id },
      include: ["category"],
      order: [["createdAt", "DESC"]],
    });

    res.json({ user, furnitures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload or update profile photo
export const updateProfilePhoto = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePhoto = req.file.path;
    await user.save();

    res.json({ message: "Profile photo updated", url: user.profilePhoto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status (block/unblock or make/remove admin)
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

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
