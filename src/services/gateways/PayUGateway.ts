import {
  PaymentGateway,
  GatewayResponse,
} from "../../types/gateway";

import { updateGatewayHealth }
from "../health/updateGatewayHealth";

import { CircuitBreakerService }
from "../circuit-breaker/CircuitBreakerService";

export class PayUGateway
  implements PaymentGateway {

  async processPayment(
    data: {
      amount: number;
      currency: string;
    }
  ): Promise<GatewayResponse> {

    const startTime = Date.now();

    try {

      // Simulate PayU behaviour
      const random =
        Math.random();

      let response:
        GatewayResponse;

      if (random < 0.8) {

        response = {
          success: true,
          gateway: "payu",
          transactionId:
            "payu_" + Date.now(),
        };

      } else {

        response = {
          success: false,
          gateway: "payu",
          error: "PayU Processing Failed",
        };
      }

      const latency =
        Date.now() - startTime;

      await updateGatewayHealth(
        "payu",
        response.success,
        latency
      );

      const breaker =
        new CircuitBreakerService();

      if (
        response.success
      ) {

        await breaker.recordSuccess(
          "payu"
        );

      } else {

        await breaker.recordFailure(
          "payu"
        );
      }

      return response;

    } catch (error) {

      const latency =
        Date.now() - startTime;

      await updateGatewayHealth(
        "payu",
        false,
        latency
      );

      const breaker =
        new CircuitBreakerService();

      await breaker.recordFailure(
        "payu"
      );

      return {
        success: false,
        gateway: "payu",
        error: "PayU Processing Failed",
      };
    }
  }
}