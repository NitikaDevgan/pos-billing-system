export type PaymentMethod = 'CASH' | 'UPI' | 'CARD';

export const paymentMethodLabels: Record<PaymentMethod, string> = { CASH: 'Cash', UPI: 'UPI', CARD: 'Card' };

/** Decimal columns arrive as strings, e.g. "80.00". */
export interface OrderItem {
  id: string;
  productId: string | null;
  name: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
}

export interface Order {
  id: string;
  billNumber: number;
  subtotal: string;
  total: string;
  paymentMethod: PaymentMethod;
  amountReceived: string | null;
  changeDue: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderInput {
  items: { productId: string; quantity: number }[];
  paymentMethod: PaymentMethod;
  amountReceived?: number;
}
