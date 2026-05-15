export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'member' | 'admin';
}

export interface Member extends User {
  role: 'member';
  walletBalance: number;
}

export interface Admin extends User {
  role: 'admin';
}
