import mongoose from "mongoose";

const circuitBreakerSchema =
  new mongoose.Schema(
    {
      gateway: {
        type: String,
        unique: true,
      },

      state: {
        type: String,
        default: "CLOSED",
      },

      failureCount: {
        type: Number,
        default: 0,
      },

      lastFailureAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "CircuitBreaker",
  circuitBreakerSchema
);