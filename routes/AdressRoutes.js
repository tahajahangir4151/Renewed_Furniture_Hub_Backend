import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getAddress,
    upsertAddress,
    setDefaultAddress,
} from "../controllers/adressController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Manage user shipping addresses
 */

/**
 * @swagger
 * /api/address:
 *   get:
 *     summary: Get all addresses of the logged-in user
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fullName:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   city:
 *                     type: string
 *                   street:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   isDefault:
 *                     type: boolean
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 */

/**
 * @swagger
 * /api/address:
 *   post:
 *     summary: Add a new address for the user
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - city
 *               - street
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *               street:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address added/updated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/address/{id}/default:
 *   put:
 *     summary: Set a specific address as default
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Default address updated
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */

router.get("/", protect, getAddress);
router.post("/", protect, upsertAddress);
router.put("/:id/default", protect, setDefaultAddress);

export default router;
