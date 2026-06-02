import { Request, Response }
from "express";

import ProcessedWebhookEvent
from "../repositories/models/ProcessedWebhookEvent";

import Transaction
from "../repositories/models/Transaction";

import AuditLog
from "../repositories/models/AuditLog";

import { changeTransactionState }
from "../services/state-machine/changeTransactionState";

import { TransactionState }
from "../types/transaction";

export const stripeWebhook =
async (
  req: Request,
  res: Response
) => {

  try {

    const {
      eventId,
      transactionId,
      status,
    } = req.body;

    const existingEvent =
      await ProcessedWebhookEvent
      .findOne({
        eventId,
      });

    if (existingEvent) {

      return res.status(200).json({
        success: true,
        duplicate: true,
      });
    }

    await ProcessedWebhookEvent
      .create({
        eventId,
        gateway: "stripe",
      });

    const transaction =
      await Transaction.findById(
        transactionId
      );

    if (!transaction) {

      return res.status(404).json({
        success: false,
        message:
          "Transaction not found",
      });
    }

    if (
      status === "SUCCESS"
    ) {

      await changeTransactionState(
        transaction,
        TransactionState.SUCCESS,
        "WEBHOOK_SUCCESS"
      );
    }

    await AuditLog.create({
      transactionId:
        transaction._id,

      oldState:
        transaction.state,

      newState:
        status,

      event:
        "WEBHOOK_RECEIVED",
    });

    return res.status(200).json({
      success: true,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};