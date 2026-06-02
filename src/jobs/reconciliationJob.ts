import Transaction from
"../repositories/models/Transaction";

import ReconciliationJob from
"../repositories/models/ReconciliationJob";

export const runReconciliation =
async () => {

  console.log(
    "Starting reconciliation..."
  );

  const startedAt =
    new Date();

  const transactions =
    await Transaction.find();

  let mismatches = 0;

  for (const tx of transactions) {

    // Mock gateway status check

    const gatewayStatus =
      tx.state;

    if (
      gatewayStatus !==
      tx.state
    ) {

      mismatches++;
    }
  }

  await ReconciliationJob.create({
    startedAt,

    completedAt:
      new Date(),

    transactionsChecked:
      transactions.length,

    mismatches,
  });

  console.log(
    "Reconciliation complete"
  );
};