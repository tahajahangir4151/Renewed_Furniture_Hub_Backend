import Furniture from "../models/Furniture.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import { Op } from "sequelize";

// @desc Upload a new furniture item
// @route POST /api/furniture
// @access Private (only registered users)
export const createFurniture = async (req, res) => {
  try {
    const { title, description, price, condition, location, saleId } = req.body;
    let categoryId = req.body.category; // Extract category field as categoryId

    // Convert categoryId to an integer
    categoryId = parseInt(categoryId, 10);

    // Debugging logs
    console.log("Request received at createFurniture");
    console.log("Request body:", req.body);
    console.log("Category ID received:", categoryId);
    console.log("Type of categoryId after conversion:", typeof categoryId);

    // Validate categoryId
    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({ message: "Category ID is required and must be a valid number" });
    }

    // Check if categoryId exists in the Category table
    const categoryExists = await Category.findByPk(categoryId);
    console.log("Category exists check result:", categoryExists);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    const images = req.files?.map((file) => file.path);
    console.log("Images received:", images);
    console.log("Type of images:", typeof images);

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Serialize images array into a JSON string
    const serializedImages = JSON.stringify(images);

    const newFurniture = await Furniture.create({
      title,
      description,
      price,
      categoryId: parseInt(categoryId, 10), // Explicitly cast categoryId to integer
      condition,
      location,
      images: serializedImages, // Save serialized images
      ownerId: req.user.id,
      approved: req.user.role === "admin" ? true : false,
      saleId: saleId || null,
    });

    res.status(201).json({ message: "Furniture uploaded", data: newFurniture });
  } catch (error) {
    console.error("Error in createFurniture:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Get all furniture items (only approved)
// @route GET /api/furniture
// @access Public
export const getFurniture = async (req, res) => {
  try {
    const furnitures = await Furniture.findAll({
      where: { approved: true },
      include: ["category", { model: User, as: "owner", attributes: ["name", "email"] }],
    });
    res.status(200).json(furnitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get furniture by ID (public, only approved)
// @route GET /api/furniture/:id
// @access Public
export const getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findOne({
      where: { id: req.params.id, approved: true },
      include: ["category", { model: User, as: "owner", attributes: ["name", "email"] }],
    });
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found or not approved" });
    }
    res.status(200).json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all unapproved furniture items (admin only)
// @route GET /api/furniture/unapproved
// @access Private/Admin
export const getUnapprovedFurniture = async (req, res) => {
  try {
    const furnitures = await Furniture.findAll({
      where: { approved: false },
      include: ["category", { model: User, as: "owner", attributes: ["name", "email"] }],
    });
    res.status(200).json(furnitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all furniture items (admin only, approved + unapproved)
// @route GET /api/furniture/all
// @access Private/Admin
export const getAllFurniture = async (req, res) => {
  try {
    const furnitures = await Furniture.findAll({
      include: ["category", { model: User, as: "owner", attributes: ["name", "email"] }],
    });
    res.status(200).json(furnitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve a furniture item (admin only)
// @route PATCH /api/furniture/:id/approve
// @access Private/Admin
export const approveFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByPk(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }

    furniture.approved = true;
    await furniture.save();

    res.status(200).json({ message: "Furniture approved", data: furniture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Decline a furniture item (admin only)
// @route PATCH /api/furniture/:id/decline
// @access Private/Admin
export const declineFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByPk(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }
    await furniture.destroy();
    res.status(200).json({ message: "Furniture declined and removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update furniture (owner or admin)
// @route PUT /api/furniture/:id
// @access Private (owner or admin)
export const updateFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByPk(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }
    // Only owner or admin can update
    if (furniture.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    // Update fields
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        furniture[key] = req.body[key];
      }
    });
    // If new images uploaded
    if (req.files && req.files.length > 0) {
      furniture.images = req.files.map((file) => file.path);
    }
    await furniture.save();
    res.json({ message: "Furniture updated", data: furniture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete furniture (owner or admin)
// @route DELETE /api/furniture/:id
// @access Private (owner or admin)
export const deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByPk(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }
    // Only owner or admin can delete
    if (furniture.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    await furniture.destroy();
    res.json({ message: "Furniture deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get featured furniture for carousel fallback
// @route GET /api/furniture/featured
// @access Public
export const getFeaturedFurniture = async (req, res) => {
  try {
    // You can define your own logic for 'featured', e.g. most recent, most popular, or a flag
    // Here, we'll just return the latest 5 approved furniture items
    const featured = await Furniture.findAll({
      where: { approved: true },
      order: [["createdAt", "DESC"]],
      limit: 5,
      include: ["category", { model: User, as: "owner", attributes: ["name", "email"] }],
    });
    res.status(200).json(featured);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch featured furniture",
      error: error.message,
    });
  }
};
