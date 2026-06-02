import mongoose from "mongoose";

const webhookEventSchema =
  new mongoose.Schema(
    {
      eventId: {
        type: String,
        unique: true,
      },

      gateway: String,

      eventType: String,

      payload: Object,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "WebhookEvent",
  webhookEventSchema
);