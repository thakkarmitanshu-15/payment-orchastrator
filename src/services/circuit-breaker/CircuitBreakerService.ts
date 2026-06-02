import CircuitBreakerModel
from "../../repositories/models/CircuitBreaker";

import { CircuitState }
from "../../types/circuitBreaker";

export class CircuitBreakerService {

  async recordSuccess(
    gateway: string
  ) {

    let breaker =
      await CircuitBreakerModel.findOne({
        gateway,
      });

    if (!breaker) {

      breaker =
        await CircuitBreakerModel.create({
          gateway,
        });
    }

    breaker.failureCount = 0;

    breaker.state =
      CircuitState.CLOSED;

    breaker.lastFailureAt =
      undefined;

    await breaker.save();
  }

  async recordFailure(
    gateway: string
  ) {

    let breaker =
      await CircuitBreakerModel.findOne({
        gateway,
      });

    if (!breaker) {

      breaker =
        await CircuitBreakerModel.create({
          gateway,
        });
    }

    breaker.failureCount += 1;

    // HALF_OPEN failure immediately reopens circuit
    if (
      breaker.state ===
      CircuitState.HALF_OPEN
    ) {

      breaker.state =
        CircuitState.OPEN;

      breaker.lastFailureAt =
        new Date();

      await breaker.save();

      return;
    }

    if (
      breaker.failureCount >= 5
    ) {

      breaker.state =
        CircuitState.OPEN;

      breaker.lastFailureAt =
        new Date();
    }

    await breaker.save();
  }

  async canUseGateway(
    gateway: string
  ) {

    const breaker =
      await CircuitBreakerModel.findOne({
        gateway,
      });

    if (!breaker) {
      return true;
    }

    // OPEN -> HALF_OPEN after 30 sec
    if (
      breaker.state ===
      CircuitState.OPEN
    ) {

      const now =
        Date.now();

      const lastFailure =
        breaker.lastFailureAt
          ? new Date(
              breaker.lastFailureAt
            ).getTime()
          : 0;

      const elapsed =
        now - lastFailure;

      if (
        elapsed > 30000
      ) {

        breaker.state =
          CircuitState.HALF_OPEN;

        await breaker.save();

        console.log(
          "Circuit moved to HALF_OPEN"
        );

        return true;
      }

      return false;
    }

    return true;
  }
}