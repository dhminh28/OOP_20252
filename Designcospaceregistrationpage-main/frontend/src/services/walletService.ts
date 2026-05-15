import { apiFetch } from './api';
import type { Wallet } from '../types/wallet';

interface BackendWallet {
  walletId: number;
  balance: number;
}

export async function getBalance(): Promise<Wallet> {
  const wallet = await apiFetch<BackendWallet>('/wallet');
  return {
    walletId: String(wallet.walletId),
    balance: Number(wallet.balance),
  };
}

export async function recharge(amount: number): Promise<Wallet> {
  const wallet = await apiFetch<BackendWallet>('/wallet/recharge', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });

  return {
    walletId: String(wallet.walletId),
    balance: Number(wallet.balance),
  };
}
