import Furniture from "../models/Furniture.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Sale from "../models/Sale.js";

// @desc Upload a new furniture item
// @route POST /api/furniture
// @access Private (only registered users)
export const createFurniture = async (req, res) => {
  try {
    const { title, description, price, category, condition, location, sale } =
      req.body;

    const images = req.files?.map((file) => file.path);
    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    // Validate the sale field
    const saleValue = sale && sale.match(/^[0-9a-fA-F]{24}$/) ? sale : null;

    const newFurniture = new Furniture({
      title,
      description,
      price,
      category,
      condition,
      location,
      images,
      owner: req.user._id,
      approved: req.user.role === "admin" ? true : false,
      sale: saleValue, // Set sale to null if not valid
    });

    await newFurniture.save();
    res.status(201).json({ message: "Furniture uploaded", data: newFurniture });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload furniture", error: error.message });
  }
};

// @desc    Get all furniture items (only approved)
// @route   GET /api/furniture
// @access  Public
export const getFurniture = async (req, res) => {
  try {
    const furnitures = await Furniture.findAll({
      where: { approved: true },
      include: [
        { model: Category, as: "category" },
        { model: Sale, as: "sale" },
        { model: User, as: "owner", attributes: ["name", "email"] },
      ],
    });
    res.status(200).json(furnitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get furniture by ID (public, only approved)
// @route   GET /api/furniture/:id
// @access  Public
export const getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findOne({
      _id: req.params.id,
      approved: true,
    })
      .populate("category")
      .populate("owner", "name email");
    if (!furniture) {
      return res
        .status(404)
        .json({ message: "Furniture not found or not approved" });
    }
    res.status(200).json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unapproved furniture items (admin only)
// @route   GET /api/furniture/unapproved
// @access  Private/Admin
export const getUnapprovedFurniture = async (req, res) => {
  try {
    const furnitures = await Furniture.find({ approved: false })
      .populate("category")
      .populate("owner", "name email");
    res.status(200).json(furnitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all furniture items (admin only, approved + unapproved)
// @route   GET /api/furniture/all
// @access  Private/Admin
export const getAllFurniture = async (req, res) => {
  try {
    const furnitures = await Furniture.find()
      .populate("category")
      .populate("owner", "name email");
    res.status(200).json(furnitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a furniture item (admin only)
// @route   PATCH /api/furniture/:id/approve
// @access  Private/Admin
export const approveFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
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

// @desc    Decline a furniture item (admin only)
// @route   PATCH /api/furniture/:id/decline
// @access  Private/Admin
export const declineFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }
    await furniture.deleteOne();
    res.status(200).json({ message: "Furniture declined and removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update furniture (owner or admin)
// @route   PUT /api/furniture/:id
// @access  Private (owner or admin)
export const updateFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }
    // Only owner or admin can update
    if (
      furniture.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    // Update fields
    const fields = [
      "title",
      "description",
      "price",
      "category",
      "condition",
      "location",
      "status",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) furniture[field] = req.body[field];
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

// @desc    Delete furniture (owner or admin)
// @route   DELETE /api/furniture/:id
// @access  Private (owner or admin)
export const deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }
    // Only owner or admin can delete
    if (
      furniture.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await furniture.deleteOne();
    res.json({ message: "Furniture deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured furniture for carousel fallback
// @route   GET /api/furniture/featured
// @access  Public
export const getFeaturedFurniture = async (req, res) => {
  try {
    // You can define your own logic for 'featured', e.g. most recent, most popular, or a flag
    // Here, we'll just return the latest 5 approved furniture items
    const featured = await Furniture.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("category")
      .populate("owner", "name email");
    res.status(200).json(featured);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch featured furniture",
      error: error.message,
    });
  }
};
