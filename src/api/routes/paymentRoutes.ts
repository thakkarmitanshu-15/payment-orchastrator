import { Router } from "express";

import {
  createPayment,
} from "../../controllers/paymentController";

import { authMiddleware }
from "../../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchantId:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               idempotencyKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created
 */
router.post("/", createPayment);

router.post(
  "/",
  authMiddleware,
  createPayment
);

export default router;