export interface GatewayResponse {
  success: boolean;
  gateway: string;
  transactionId?: string;
  error?: string;
  raw?: any;
}

export interface PaymentGateway {
  processPayment(data: {
    amount: number;
    currency: string;
  }): Promise<GatewayResponse>;
}