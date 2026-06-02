import { paymentRetryQueue }
from "../../queues/paymentRetryQueue";

export const addRetryJob = async (
  transactionId: string
) => {

  await paymentRetryQueue.add(
    "retry-payment",

    {
      transactionId,
    },

    {
      attempts: 3,

      backoff: {
        type: "fixed",
        delay: 2000,
      },
    }
  );
};