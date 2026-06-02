import express from "express";
import cors from "cors";
import paymentRoutes from "./api/routes/paymentRoutes";

import healthRoutes from "./api/routes/healthRoutes";
import webhookRoutes from "./api/routes/webhookRoutes";

import metricsRoutes
from "./api/routes/metricsRoutes";

import swaggerUi from
"swagger-ui-express";

import { swaggerSpec }
from "./config/swagger";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/payments", paymentRoutes);

app.use(
  "/webhooks",
  webhookRoutes
);
app.use(
  "/metrics",
  metricsRoutes
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

export default app;