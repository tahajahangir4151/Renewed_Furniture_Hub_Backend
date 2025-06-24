/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get all wishlist items for the logged-in user
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist items
 */

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add an item to the wishlist
 *     tags: [Wishlist]
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
 *     responses:
 *       201:
 *         description: Wishlist item added
 */

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: Remove an item from the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Wishlist item ID
 *     responses:
 *       200:
 *         description: Wishlist item removed
 */

/**
 * @swagger
 * /api/wishlist:
 *   delete:
 *     summary: Clear the wishlist for the logged-in user
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared
 */

import express from "express";
import {
    getWishlist,
    addToWishlist,
    removeWishlistItem,
    clearWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/", protect, addToWishlist);
router.delete("/:id", protect, removeWishlistItem);
router.delete("/", protect, clearWishlist);

export default router;
