import Transaction from "../../repositories/models/Transaction";
import AuditLog from "../../repositories/models/AuditLog";

import { TransactionState } from "../../types/transaction";

import { TransactionStateMachine } from "./TransactionStateMachine";

const stateMachine =
  new TransactionStateMachine();

export const changeTransactionState = async (
  transaction: any,
  nextState: TransactionState,
  event: string,
  metadata: any = {}
) => {

  const currentState =
    transaction.state as TransactionState;

  const valid =
    stateMachine.canTransition(
      currentState,
      nextState
    );

  if (!valid) {

    throw new Error(
      `Invalid transition ${currentState} -> ${nextState}`
    );
  }

  transaction.state = nextState;

  await transaction.save();

  await AuditLog.create({
    transactionId: transaction._id,

    oldState: currentState,

    newState: nextState,

    event,

    metadata,
  });

  return transaction;
};