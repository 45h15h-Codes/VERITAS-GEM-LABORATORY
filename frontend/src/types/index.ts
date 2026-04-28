export interface Certificate {
  id: string;
  certificate_number: string;
  type: 'diamond' | 'jewellery';
  certifier_name: string;
  store: string;
  image_url?: string;
  title: string;
  date: string;
  item: string;
  length?: string;
  weight: string;
  carat_weight?: number;
  gem_stone?: string;
  color?: string;
  clarity?: string;
  metal_purity: string;
  value: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Payment {
  id: string;
  certificate_id: string;
  client_name: string;
  email: string;
  mobile: string;
  address: string;
  payment_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'shipped' | 'cancelled' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface DashboardStats {
  totalCertificates: number;
  totalSales: number;
  recentPayments: Payment[];
}
