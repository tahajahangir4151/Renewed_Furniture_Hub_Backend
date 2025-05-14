import Furniture from "../models/Furniture.js";

// @desc Upload a new furniture item
// @route POST /api/furniture
// @access Private (only registered users)
export const createFurniture = async (req, res) => {
  try {
    const { title, description, price, category, condition, location } =
      req.body;

    const images = req.files?.map((file) => file.path);
    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const newFurniture = new Furniture({
      title,
      description,
      price,
      category,
      condition,
      location,
      images,
      owner: req.user._id,
    });

    await newFurniture.save();
    res.status(201).json({ message: "Furniture uploaded", data: newFurniture });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload furniture", error: error.message });
  }
};

// @desc    Get all furniture items
// @route   GET /api/furniture
// @access  Public
export const getFurniture = async (req, res) => {
  try {
    const furnitures = await Furniture.find().populate('category').populate('owner', 'name email');
    res.status(200).json(furnitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
