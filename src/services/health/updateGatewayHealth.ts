import GatewayHealth
from "../../repositories/models/GatewayHealth";

export const updateGatewayHealth =
  async (
    gateway: string,
    success: boolean,
    latency: number
  ) => {

    let stats =
      await GatewayHealth.findOne({
        gateway,
      });

    if (!stats) {

      stats =
        await GatewayHealth.create({
          gateway,
        });
    }

    if (success) {
      stats.successCount += 1;
    } else {
      stats.failureCount += 1;
    }

    stats.totalLatency += latency;

    const totalRequests =
      stats.successCount +
      stats.failureCount;

    const successRate =
      totalRequests === 0
        ? 0
        : (
            stats.successCount /
            totalRequests
          ) * 100;

    stats.healthScore =
      Math.round(successRate);

    await stats.save();
  };