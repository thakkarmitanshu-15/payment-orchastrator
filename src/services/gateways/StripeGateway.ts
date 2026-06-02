import {
  PaymentGateway,
  GatewayResponse,
} from "../../types/gateway";

import { updateGatewayHealth }
from "../health/updateGatewayHealth";

import { CircuitBreakerService }
from "../circuit-breaker/CircuitBreakerService";

export class StripeGateway
  implements PaymentGateway {

  async processPayment(
    data: {
      amount: number;
      currency: string;
    }
  ): Promise<GatewayResponse> {

    const startTime = Date.now();

    try {

      const response = {
        success: true,
        gateway: "stripe",
        transactionId:
          "stripe_" + Date.now(),
      };

      const latency =
        Date.now() - startTime;

      await updateGatewayHealth(
        "stripe",
        true,
        latency
      );
const breaker =
  new CircuitBreakerService();

await breaker.recordSuccess(
  "stripe"
);
      return response;

    } catch (error) {

      const latency =
        Date.now() - startTime;

      await updateGatewayHealth(
        "stripe",
        false,
        latency
      );

      return {
        success: false,
        gateway: "stripe",
        error: "Stripe Processing Failed",
      };
    }
  }
}