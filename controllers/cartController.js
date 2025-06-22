import Cart from "../models/Cart.js";
import Furniture from "../models/Furniture.js";

// Get all cart items for a user
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Furniture }],
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add or update cart item
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    let cartItem = await Cart.findOne({ where: { userId, productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, productId, quantity });
    }
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;
    const cartItem = await Cart.findOne({ where: { id, userId } });
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    if (quantity === 0) {
      await cartItem.destroy();
      return res.json({ message: "Item removed (quantity was 0)" });
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const cartItem = await Cart.findOne({ where: { id, userId } });
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    await cartItem.destroy();
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear all items for user
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.destroy({ where: { userId } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
