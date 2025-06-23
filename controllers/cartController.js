import Cart from "../models/Cart.js";
import Furniture from "../models/Furniture.js";
import Sale from "../models/Sale.js";

// Get all cart items for a user
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Furniture,
        include: [{ model: Sale, as: "sale" }]
      }],
    });
    // Map to include full product details in response
    const cartWithProduct = cartItems.map((item) => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: item.Furniture, // full product details with sale info
    }));
    res.json(cartWithProduct);
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
    // Fetch full product details for response
    const product = await Furniture.findByPk(productId, {
      include: [{ model: Sale, as: "sale" }]
    });

    res.status(201).json({
      id: cartItem.id,
      userId: cartItem.userId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
      product,
      Sale: product.sale,
    });
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
    // Fetch full product details for response (with sale info)
    const product = await Furniture.findByPk(cartItem.productId, {
      include: [{ model: Sale, as: "sale" }]
    });
    res.json({
      id: cartItem.id,
      userId: cartItem.userId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
      product,
    });
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
