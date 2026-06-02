import mongoose from "mongoose";

import { TransactionState } from "../../types/transaction";

const transactionSchema = new mongoose.Schema(
  {
    merchantId: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    gateway: {
      type: String,
    },

    state: {
      type: String,
      enum: Object.values(TransactionState),
      default: TransactionState.CREATED,
    },

    idempotencyKey: {
      type: String,
      unique: true,
      required: true,
    },

    retryCount: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

export default Transaction;