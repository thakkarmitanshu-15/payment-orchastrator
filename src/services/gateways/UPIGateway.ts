import {
  PaymentGateway,
  GatewayResponse,
} from "../../types/gateway";

import { updateGatewayHealth }
from "../health/updateGatewayHealth";

import { CircuitBreakerService }
from "../circuit-breaker/CircuitBreakerService";

export class UPIGateway
  implements PaymentGateway {

  async processPayment(
    data: {
      amount: number;
      currency: string;
    }
  ): Promise<GatewayResponse> {

    const startTime =
      Date.now();

    try {

      const random =
        Math.random();

      let response:
        GatewayResponse;

      if (random < 0.7) {

        response = {
          success: true,
          gateway: "upi",
          transactionId:
            "upi_" + Date.now(),
        };

      } else {

        response = {
          success: false,
          gateway: "upi",
          error:
            "UPI Collect Expired",
        };
      }

      const latency =
        Date.now() -
        startTime;

      await updateGatewayHealth(
        "upi",
        response.success,
        latency
      );

      const breaker =
        new CircuitBreakerService();

      if (
        response.success
      ) {

        await breaker.recordSuccess(
          "upi"
        );

      } else {

        await breaker.recordFailure(
          "upi"
        );
      }

      return response;

    } catch {

      return {
        success: false,
        gateway: "upi",
        error:
          "UPI Processing Failed",
      };
    }
  }
}