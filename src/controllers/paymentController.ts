import { Request, Response } from "express";

import Transaction from "../repositories/models/Transaction";
import AuditLog from "../repositories/models/AuditLog";

import { createPaymentValidator } from "../utils/validators/createPaymentValidator";

import { changeTransactionState } from "../services/state-machine/changeTransactionState";

import { TransactionState } from "../types/transaction";

import { RoutingEngine } from "../services/routing/RoutingEngine";

import { StripeGateway } from "../services/gateways/StripeGateway";

import { RazorpayGateway } from "../services/gateways/RazorpayGateway";

import { addRetryJob } from "../services/retries/addRetryJob";

import { PayUGateway } from "../services/gateways/PayUGateway";

import { UPIGateway } from "../services/gateways/UPIGateway";
export const createPayment = async (
  req: Request,
  res: Response
) => {
  try {

    const validatedData =
      createPaymentValidator.parse(req.body);

    const existingTransaction =
      await Transaction.findOne({
        idempotencyKey:
          validatedData.idempotencyKey,
      });

    if (existingTransaction) {

      return res.status(200).json({
        success: true,
        duplicate: true,
        transaction: existingTransaction,
      });

    }

    const transaction =
      await Transaction.create({
        merchantId: validatedData.merchantId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        idempotencyKey:
          validatedData.idempotencyKey,

        state: TransactionState.CREATED,
      });

    await AuditLog.create({
      transactionId: transaction._id,

      oldState: null,

      newState: TransactionState.CREATED,

      event: "PAYMENT_CREATED",

      metadata: {
        amount: transaction.amount,
        currency: transaction.currency,
      },
    });

    await changeTransactionState(
      transaction,
      TransactionState.ROUTING,
      "ROUTING_STARTED"
    );

    const routingEngine =
      new RoutingEngine();

    const selectedGateway =
  await routingEngine.selectGateway();

  console.log(
  "Selected Gateway:",
  selectedGateway
);

    let gatewayResponse;

    await changeTransactionState(
      transaction,
      TransactionState.PROCESSING,
      "GATEWAY_PROCESSING"
    );

    if (selectedGateway === "stripe") {

  const gateway =
    new StripeGateway();

  gatewayResponse =
    await gateway.processPayment({
      amount: transaction.amount,
      currency: transaction.currency,
    });

} else if (
  selectedGateway === "payu"
) {

  const gateway =
    new PayUGateway();

  gatewayResponse =
    await gateway.processPayment({
      amount: transaction.amount,
      currency: transaction.currency,
    });

} else if (
  selectedGateway === "upi"
) {

  const gateway =
    new UPIGateway();

  gatewayResponse =
    await gateway.processPayment({
      amount: transaction.amount,
      currency: transaction.currency,
    });

}
else {

  const gateway =
    new RazorpayGateway();

  gatewayResponse =
    await gateway.processPayment({
      amount: transaction.amount,
      currency: transaction.currency,
    });

}

    if (gatewayResponse.success) {

      transaction.gateway =
        gatewayResponse.gateway;

      await transaction.save();

      await changeTransactionState(
        transaction,
        TransactionState.SUCCESS,
        "PAYMENT_SUCCESS",
        {
          gateway:
            gatewayResponse.gateway,

          gatewayTransactionId:
            gatewayResponse.transactionId,
        }
      );

    } else {

      console.log(
        "Adding retry for transaction:",
        transaction._id
      );

      await addRetryJob(
        transaction._id.toString()
      );

      await changeTransactionState(
        transaction,
        TransactionState.FAILED,
        "PAYMENT_FAILED",
        {
          gateway:
            gatewayResponse.gateway,

          error:
            gatewayResponse.error,
        }
      );

    }

    const updatedTransaction =
      await Transaction.findById(
        transaction._id
      );

    return res.status(201).json({
      success: gatewayResponse.success,

      gateway:
        gatewayResponse.gateway,

      transaction:
        updatedTransaction,

      gatewayResponse,
    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};