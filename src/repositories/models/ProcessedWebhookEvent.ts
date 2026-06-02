import mongoose from "mongoose";

const processedWebhookSchema =
  new mongoose.Schema(
    {
      eventId: {
        type: String,
        unique: true,
      },

      gateway: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "ProcessedWebhookEvent",
  processedWebhookSchema
);