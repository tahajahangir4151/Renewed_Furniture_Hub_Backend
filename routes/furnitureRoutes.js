import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import { createFurniture, getFurniture } from "../controllers/furnitureController.js";

const router = express.Router();

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
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 */
router.get("/", getFurniture);

export default router;