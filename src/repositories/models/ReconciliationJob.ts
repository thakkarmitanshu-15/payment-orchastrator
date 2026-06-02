import mongoose from "mongoose";

const reconciliationJobSchema =
  new mongoose.Schema(
    {
      startedAt: {
        type: Date,
        required: true,
      },

      completedAt: {
        type: Date,
        required: true,
      },

      transactionsChecked: {
        type: Number,
        default: 0,
      },

      mismatches: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "ReconciliationJob",
  reconciliationJobSchema
);