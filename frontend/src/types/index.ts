
export type Status = 'pending' | 'approved' | 'converted' | 'cancelled';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  createdAt: string;
}

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  tax: number;
  amount: number;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  client: Client;
  items: EstimateItem[];
  subTotal: number;
  tax: number;
  discount: number;
  total: number;
  status: Status;
  date: string;
  dueDate: string;
  terms?: string;
  notes?: string;
  logo?: string;
  createdAt: string;
}
