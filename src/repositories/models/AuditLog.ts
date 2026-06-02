import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

    oldState: String,

    newState: String,

    event: String,

    metadata: Object,
  },

  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model(
  "AuditLog",
  auditLogSchema
);

export default AuditLog;