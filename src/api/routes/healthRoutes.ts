import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Service health
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service healthy
 */
router.get("/", (_, res) => {

  res.json({
    success: true,
    message: "Payment Orchestrator Running",
  });

});

export default router;