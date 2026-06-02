import { Queue } from "bullmq";

export const paymentRetryQueue =
  new Queue(
    "payment-retries",
    {
      connection: {
  host:
    process.env.REDIS_HOST ||
    "127.0.0.1",

  port:
    Number(
      process.env.REDIS_PORT
    ) || 6379,
},
    }
  );