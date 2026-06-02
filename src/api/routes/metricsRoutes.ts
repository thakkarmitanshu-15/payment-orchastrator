import { Router } from "express";

import {
  getMetrics,
} from "../../controllers/metricsController";

const router = Router();

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Gateway metrics
 *     tags:
 *       - Metrics
 *     responses:
 *       200:
 *         description: Metrics fetched
 */
router.get(
  "/",
  getMetrics
);

export default router;