import { Worker } from "bullmq";

import Transaction from "../repositories/models/Transaction";

import { StripeGateway }
from "../services/gateways/StripeGateway";

import { RazorpayGateway }
from "../services/gateways/RazorpayGateway";

import { PayUGateway }
from "../services/gateways/PayUGateway";

import { RoutingEngine }
from "../services/routing/RoutingEngine";

import { changeTransactionState }
from "../services/state-machine/changeTransactionState";

import { TransactionState }
from "../types/transaction";

import { UPIGateway }
from "../services/gateways/UPIGateway";

export const paymentRetryWorker = new Worker(
  "payment-retries",

  async (job) => {

    try {

      const transaction =
        await Transaction.findById(
          job.data.transactionId
        );

      if (!transaction) {
        return;
      }

      console.log(
        "Failing over transaction:",
        transaction._id
      );

      const routingEngine =
        new RoutingEngine();

      const nextGateway =
        await routingEngine.selectGateway();

      console.log(
        "Retry Worker Selected:",
        nextGateway
      );

      let response;

      if (
        nextGateway === "stripe"
      ) {

        const gateway =
          new StripeGateway();

        response =
          await gateway.processPayment({
            amount: transaction.amount,
            currency: transaction.currency,
          });

      } else if (
        nextGateway === "payu"
      ) {

        const gateway =
          new PayUGateway();

        response =
          await gateway.processPayment({
            amount: transaction.amount,
            currency: transaction.currency,
          });

      }else if (
  nextGateway === "upi"
) {

  const gateway =
    new UPIGateway();

  response =
    await gateway.processPayment({
      amount: transaction.amount,
      currency: transaction.currency,
    });
} else {

        const gateway =
          new RazorpayGateway();

        response =
          await gateway.processPayment({
            amount: transaction.amount,
            currency: transaction.currency,
          });
      }

      console.log(
        "Gateway Response:",
        response
      );

      if (response.success) {

        transaction.gateway =
          response.gateway;

        await transaction.save();

        await changeTransactionState(
          transaction,
          TransactionState.RETRYING,
          "RETRY_STARTED"
        );

        await changeTransactionState(
          transaction,
          TransactionState.SUCCESS,
          "FAILOVER_SUCCESS",
          {
            gateway:
              response.gateway,

            gatewayTransactionId:
              response.transactionId,
          }
        );

        console.log(
          "✅ Failover successful"
        );

      } else {

        console.log(
          "❌ Failover failed"
        );
      }

    } catch (error) {

      console.error(
        "WORKER ERROR:",
        error
      );

      throw error;
    }
  },

  {
    connection: {
  host:
    process.env.REDIS_HOST ||
    "127.0.0.1",

  port:
    Number(
      process.env.REDIS_PORT
    ) || 6379,
}
  }
);