// src/services/state-machine/TransactionStateMachine.ts

import { TransactionState } from "../../types/transaction";

export class TransactionStateMachine {
  private transitions: Record<
    TransactionState,
    TransactionState[]
  > = {
    [TransactionState.CREATED]: [
      TransactionState.ROUTING,
    ],

    [TransactionState.ROUTING]: [
      TransactionState.PROCESSING,
      TransactionState.FAILED,
    ],

    [TransactionState.PROCESSING]: [
      TransactionState.SUCCESS,
      TransactionState.FAILED,
    ],

    [TransactionState.FAILED]: [
      TransactionState.RETRYING,
      TransactionState.FAILED_FINAL,
    ],

   [TransactionState.RETRYING]: [
  TransactionState.PROCESSING,
  TransactionState.SUCCESS,
  TransactionState.FAILED_FINAL,
],

    [TransactionState.SUCCESS]: [],

    [TransactionState.FAILED_FINAL]: [],
  };

  canTransition(
    currentState: TransactionState,
    nextState: TransactionState
  ): boolean {
    return this.transitions[currentState].includes(
      nextState
    );
  }

  getAllowedTransitions(
    currentState: TransactionState
  ): TransactionState[] {
    return this.transitions[currentState];
  }
}