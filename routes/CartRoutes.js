/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all cart items for the logged-in user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart items
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add an item to the cart or update quantity if it exists
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Cart item added/updated
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update quantity of a cart item (if quantity is 0, item will be removed)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated or removed if quantity is 0
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed
 */

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear all items from the cart for the logged-in user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:id", protect, updateCartItem);
router.delete("/:id", protect, removeCartItem);
router.delete("/", protect, clearCart);

export default router;
