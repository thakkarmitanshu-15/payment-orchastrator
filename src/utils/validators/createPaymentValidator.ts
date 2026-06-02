import { z } from "zod";

export const createPaymentValidator = z.object({
  merchantId: z.string(),

  amount: z.number().positive(),

  currency: z.string(),

  idempotencyKey: z.string(),
});