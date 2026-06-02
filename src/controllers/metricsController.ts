import { Request, Response }
from "express";

import GatewayHealth from
"../repositories/models/GatewayHealth";

export const getMetrics =
  async (
    req: Request,
    res: Response
  ) => {

    const gateways =
      await GatewayHealth.find();

    res.json({
      gateways,
    });
  };