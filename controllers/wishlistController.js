import Furniture from "../models/Furniture.js";
import Sale from "../models/Sale.js";
import Wishlist from "../models/wishlist.js";

// Get all wishlist items for a user
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishListItems = await Wishlist.findAll({
      where: { userId },
      include: [{
        model: Furniture,
        include: [{ model: Sale, as: "sale" }]
      }],
    });

    const wishlistWithProduct = wishListItems.map((item) => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: item.Furniture,
    }));

    res.json(wishlistWithProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Check if item already in wishlist
    const existing = await Wishlist.findOne({ where: { userId, productId } });
    if (existing) return res.status(200).json({ message: "Already in wishlist" });

    const wishlistItem = await Wishlist.create({ userId, productId });

    const product = await Furniture.findByPk(productId, {
      include: [{ model: Sale, as: "sale" }],
    });

    res.status(201).json({
      id: wishlistItem.id,
      userId: wishlistItem.userId,
      productId: wishlistItem.productId,
      createdAt: wishlistItem.createdAt,
      updatedAt: wishlistItem.updatedAt,
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove single item from wishlist
export const removeWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const item = await Wishlist.findOne({ where: { id, userId } });
    if (!item) return res.status(404).json({ message: "Wishlist item not found" });

    await item.destroy();
    res.json({ message: "Item removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    await Wishlist.destroy({ where: { userId } });
    res.json({ message: "Wishlist cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
