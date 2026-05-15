export interface Wallet {
  walletId?: string;
  balance: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'topup' | 'payment' | 'refund';
  createdAt: string;
}
