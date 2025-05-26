import express from "express";
import { getCarouselSlides, createBanner } from "../controllers/bannerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carousel
 *   description: Carousel banner management
 */

/**
 * @swagger
 * /api/carousel/slides:
 *   get:
 *     summary: Get all active carousel slides
 *     tags: [Carousel]
 *     responses:
 *       200:
 *         description: List of carousel slides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   image:
 *                     type: string
 *                   title:
 *                     type: string
 *                   subtitle:
 *                     type: string
 *                   description:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   category:
 *                     type: string
 *                   price:
 *                     type: number
 *                   originalPrice:
 *                     type: number
 *                   buttonText:
 *                     type: string
 *       500:
 *         description: Failed to fetch carousel slides
 */
router.get("/slides", getCarouselSlides);

/**
 * @swagger
 * /api/carousel:
 *   post:
 *     summary: Upload a new carousel banner (admin only)
 *     tags: [Carousel]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *               buttonText:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Banner created
 *       400:
 *         description: Image is required
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin only
 */
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createBanner
);

export default router;
