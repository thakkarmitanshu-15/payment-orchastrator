import cron from "node-cron";

import {
  runReconciliation
} from "./reconciliationJob";

cron.schedule(
  "* * * * *",
  async () => {
    await runReconciliation();
  }
);