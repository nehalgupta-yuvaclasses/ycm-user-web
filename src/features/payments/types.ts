export type PaymentType = 'course' | 'test' | 'resource';
export type PaymentStatus = 'success' | 'failed' | 'pending' | 'refunded';

export interface PaymentTransaction {
  id: string;
  itemName: string;
  type: PaymentType;
  typeLabel: string;
  amount: number;
  amountLabel: string;
  status: PaymentStatus;
  createdAt: string;
  createdAtLabel: string;
  invoiceUrl: string | null;
  href: string;
}

export interface PaymentSummary {
  totalSpent: number;
  totalSpentLabel: string;
  activeCourses: number;
  lastPaymentAt: string;
  lastPaymentLabel: string;
}

export interface PaymentsOverview {
  summary: PaymentSummary | null;
  transactions: PaymentTransaction[];
}