import express from "express";
import upload from "../middleware/upload.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createFurniture,
  getFurniture,
  getUnapprovedFurniture,
  approveFurniture,
  declineFurniture,
  getAllFurniture,
  updateFurniture,
  deleteFurniture,
  getFurnitureById,
  getFeaturedFurniture,
} from "../controllers/furnitureController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Furniture
 *   description: Furniture management
 */

/**
 * @swagger
 * /api/furniture:
 *   post:
 *     summary: Upload furniture with images
 *     tags: [Furniture]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the furniture
 *               description:
 *                 type: string
 *                 description: Description of the furniture
 *               price:
 *                 type: number
 *                 description: Price of the furniture
 *               category:
 *                 type: string
 *                 description: Category ObjectId (from /api/categories)
 *               condition:
 *                 type: string
 *                 enum: [new, used, damaged]
 *                 description: Condition of the furniture
 *               location:
 *                 type: string
 *                 description: Location of the furniture
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images of the furniture
 *               sale:
 *                 type: string
 *                 description: Sale ID to associate the furniture with
 *     responses:
 *       201:
 *         description: Furniture uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, upload.array("images", 5), createFurniture);

/**
 * @swagger
 * /api/furniture:
 *   get:
 *     summary: Get all furniture items
 *     tags: [Furniture]
 *     responses:
 *       200:
 *         description: List of all furniture items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   condition:
 *                     type: string
 *                   location:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   status:
 *                     type: string
 *                   owner:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   sale:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       discount:
 *                         type: number
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 */
router.get("/", getFurniture);

/**
 * @swagger
 * /api/furniture/unapproved:
 *   get:
 *     summary: Get all unapproved furniture items (admin only)
 *     tags: [Furniture]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unapproved furniture items
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/unapproved", protect, admin, getUnapprovedFurniture);

/**
 * @swagger
 * /api/furniture/{id}/approve:
 *   patch:
 *     summary: Approve a furniture item (admin only)
 *     tags: [Furniture]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The furniture item ID
 *     responses:
 *       200:
 *         description: Furniture approved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Furniture not found
 */
router.patch("/:id/approve", protect, admin, approveFurniture);

/**
 * @swagger
 * /api/furniture/{id}/decline:
 *   patch:
 *     summary: Decline (delete) a furniture item (admin only)
 *     tags: [Furniture]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The furniture item ID
 *     responses:
 *       200:
 *         description: Furniture declined and removed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Furniture not found
 */
router.patch("/:id/decline", protect, admin, declineFurniture);

/**
 * @swagger
 * /api/furniture/all:
 *   get:
 *     summary: Get all furniture items (admin only, approved + unapproved)
 *     tags: [Furniture]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all furniture items (approved and unapproved)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/all", protect, admin, getAllFurniture);

/**
 * @swagger
 * /api/furniture/{id}:
 *   put:
 *     summary: Update furniture (owner or admin)
 *     tags: [Furniture]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The furniture item ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               condition:
 *                 type: string
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               sale:
 *                 type: string
 *                 description: Sale ID to associate the furniture with
 *     responses:
 *       200:
 *         description: Furniture updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Furniture not found
 */
router.put("/:id", protect, upload.array("images", 5), updateFurniture);

/**
 * @swagger
 * /api/furniture/{id}:
 *   delete:
 *     summary: Delete furniture (owner or admin)
 *     tags: [Furniture]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The furniture item ID
 *     responses:
 *       200:
 *         description: Furniture deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Furniture not found
 */
router.delete("/:id", protect, deleteFurniture);

/**
 * @swagger
 * /api/furniture/{id}:
 *   get:
 *     summary: Get furniture by ID (only approved)
 *     tags: [Furniture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The furniture item ID
 *     responses:
 *       200:
 *         description: Furniture item found
 *       404:
 *         description: Furniture not found or not approved
 */
router.get("/:id", getFurnitureById);

export default router;
