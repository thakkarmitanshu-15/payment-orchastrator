import { Router }
from "express";

import {
  stripeWebhook,
}
from "../../controllers/webhookController";

const router =
  Router();

  /**
 * @swagger
 * /webhooks/stripe:
 *   post:
 *     summary: Stripe webhook
 *     tags:
 *       - Webhooks
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post(
  "/stripe",
  stripeWebhook
);

export default router;