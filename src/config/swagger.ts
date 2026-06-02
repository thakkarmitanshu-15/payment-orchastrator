import swaggerJsdoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Payment Orchestrator API",
      version: "1.0.0",
      description:
        "Multi-gateway payment orchestration system",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: [
    "./src/api/routes/*.ts",
  ],
};

export const swaggerSpec =
  swaggerJsdoc(options);