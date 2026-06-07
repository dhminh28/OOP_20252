import { apiFetch } from './api';
import type { Wallet } from '../types/wallet';

interface BackendWallet {
  walletId: number;
  balance: number;
}

export type RechargeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RechargeRequest {
  id: number;
  memberId: number;
  memberName: string;
  memberEmail: string;
  amount: number;
  status: RechargeRequestStatus;
  createdAt: string;
  updatedAt?: string | null;
  note?: string | null;
}

export async function getBalance(): Promise<Wallet> {
  const wallet = await apiFetch<BackendWallet>('/wallet');
  return {
    walletId: String(wallet.walletId),
    balance: Number(wallet.balance),
  };
}

export async function recharge(amount: number): Promise<RechargeRequest> {
  return apiFetch<RechargeRequest>('/wallet/recharge', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}
