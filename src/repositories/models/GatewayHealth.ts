import mongoose from "mongoose";

const gatewayHealthSchema =
  new mongoose.Schema(
    {
      gateway: {
        type: String,
        unique: true,
      },

      successCount: {
        type: Number,
        default: 0,
      },

      failureCount: {
        type: Number,
        default: 0,
      },

      totalLatency: {
        type: Number,
        default: 0,
      },

      healthScore: {
        type: Number,
        default: 100,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "GatewayHealth",
  gatewayHealthSchema
);