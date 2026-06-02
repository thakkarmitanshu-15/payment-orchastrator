import {
  PaymentGateway,
  GatewayResponse,
} from "../../types/gateway";

import { updateGatewayHealth }
from "../health/updateGatewayHealth";


import { CircuitBreakerService }
from "../circuit-breaker/CircuitBreakerService";

export class RazorpayGateway
  implements PaymentGateway {

  async processPayment(
    data: {
      amount: number;
      currency: string;
    }
  ): Promise<GatewayResponse> {

    const startTime = Date.now();

    const latency =
      Date.now() - startTime;

console.log("Razorpay Called");
    await updateGatewayHealth(
      "razorpay",
      false,
      latency
    );

console.log("Razorpay Health Updated");
const breaker =
  new CircuitBreakerService();

await breaker.recordFailure(
  "razorpay"
);
    return {
      success: false,
      gateway: "razorpay",
      error: "Gateway Timeout",
    };
  }
}