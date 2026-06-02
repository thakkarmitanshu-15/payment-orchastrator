import GatewayHealth from
"../../repositories/models/GatewayHealth";

import { CircuitBreakerService }
from "../circuit-breaker/CircuitBreakerService";

export class RoutingEngine {

  async selectGateway() {

    const breaker =
      new CircuitBreakerService();

    const gateways: any[] =
      await GatewayHealth.find();

    if (!gateways.length) {

      return "razorpay";
    }

    gateways.sort(
      (a, b) =>
        b.healthScore -
        a.healthScore
    );

    for (const gateway of gateways) {

      const canUse =
        await breaker.canUseGateway(
          gateway.gateway
        );

      if (canUse) {

        console.log(
          "Selected Gateway:",
          gateway.gateway
        );

        return gateway.gateway;
      }
    }

    console.log(
      "All circuits open, falling back to stripe"
    );

    return "stripe";
  }
}