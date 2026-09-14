import { formatCurrency } from '../cartState';

interface CartSummaryProps {
  subtotal: number;
  isEmpty: boolean;
  onPay: () => void;
}

export function CartSummary({ subtotal, isEmpty, onPay }: CartSummaryProps) {
  return (
    <div className="cart-summary">
      <div className="total-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
      <div className="total-row total-row--grand"><span>Total</span><strong>{formatCurrency(subtotal)}</strong></div>
      <button className="customer-button" type="button" onClick={() => window.alert('Customer details will be added in a future phase.')}>+ Add Customer</button>
      <button className="pay-button" type="button" disabled={isEmpty} onClick={onPay}>PAY {formatCurrency(subtotal)}</button>
    </div>
  );
}
