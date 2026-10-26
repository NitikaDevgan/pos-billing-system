import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button/Button';
import { Input } from '../../../components/Input/Input';
import { Modal } from '../../../components/Modal/Modal';
import { getErrorMessage } from '../../../services/apiClient';
import { formatCurrency } from '../../cart/cartState';
import type { CartItem } from '../../cart/types';
import { orderApi } from '../../orders/orderApi';
import { paymentMethodLabels, type Order, type PaymentMethod } from '../../orders/types';
import { Receipt } from '../../printing/components/Receipt';
import { ReceiptPrintArea, receiptPrinter } from '../../printing/receiptPrinter';
import { getCashSuggestions } from '../cashSuggestions';

interface PaymentModalProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  /** Called as soon as the server has saved the order, so the cart can be cleared. */
  onPaid: (order: Order) => void;
  onClose: () => void;
}

const methodIcons: Record<PaymentMethod, string> = { CASH: '💵', UPI: '📱', CARD: '💳' };
const methods = Object.keys(paymentMethodLabels) as PaymentMethod[];

export function PaymentModal({ isOpen, items, total, onPaid, onClose }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [cashReceived, setCashReceived] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [order, setOrder] = useState<Order>();

  const received = Number(cashReceived);
  const hasValidCash = cashReceived.trim() !== '' && Number.isFinite(received) && received >= total;
  const canConfirm = !isSubmitting && (method !== 'CASH' || hasValidCash);

  const handleClose = () => {
    setMethod('CASH');
    setCashReceived('');
    setError(undefined);
    setOrder(undefined);
    onClose();
  };

  const handleConfirm = async (event: FormEvent) => {
    event.preventDefault();
    if (!canConfirm) return;
    setIsSubmitting(true);
    setError(undefined);
    try {
      const savedOrder = await orderApi.create({
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
        paymentMethod: method,
        ...(method === 'CASH' ? { amountReceived: received } : {}),
      });
      setOrder(savedOrder);
      onPaid(savedOrder);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = async () => {
    if (!order) return;
    try {
      await receiptPrinter.print(order);
    } catch (printError) {
      setError(`Couldn't print the bill: ${getErrorMessage(printError)}`);
    }
  };

  return (
    <Modal isOpen={isOpen} title={order ? 'Payment complete' : 'Take payment'} onClose={handleClose}>
      {order ? (
        <div className="payment">
          <div className="payment__success">
            <span aria-hidden="true">✓</span>
            <p>Bill #{order.billNumber} · paid by {paymentMethodLabels[order.paymentMethod]}</p>
            {order.changeDue !== null && Number(order.changeDue) > 0 && (
              <strong>Return change: {formatCurrency(Number(order.changeDue))}</strong>
            )}
          </div>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <div className="payment__receipt-preview"><Receipt order={order} /></div>
          <div className="admin-form__actions">
            <Button variant="secondary" onClick={handleClose}>New order</Button>
            <Button autoFocus onClick={handlePrint}>🖨 Print bill</Button>
          </div>
          <ReceiptPrintArea order={order} />
        </div>
      ) : (
        <form className="payment admin-form" onSubmit={handleConfirm} noValidate>
          <div className="payment__due">
            <span>Amount due</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <div className="payment__methods" role="radiogroup" aria-label="Payment method">
            {methods.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={method === option}
                className={method === option ? 'payment__method payment__method--active' : 'payment__method'}
                onClick={() => { setMethod(option); setError(undefined); }}
              >
                <span aria-hidden="true">{methodIcons[option]}</span>
                {paymentMethodLabels[option]}
              </button>
            ))}
          </div>
          {method === 'CASH' ? (
            <>
              <Input
                label="Cash received (₹)"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                autoFocus
                value={cashReceived}
                error={cashReceived && !hasValidCash ? `Must be at least ${formatCurrency(total)}.` : undefined}
                onChange={(event) => setCashReceived(event.target.value)}
              />
              <div className="payment__quick-cash">
                {getCashSuggestions(total).map((amount) => (
                  <Button key={amount} variant="secondary" onClick={() => setCashReceived(String(amount))}>
                    {amount === total ? 'Exact' : formatCurrency(amount)}
                  </Button>
                ))}
              </div>
              <div className="total-row">
                <span>Change to return</span>
                <strong>{hasValidCash ? formatCurrency(received - total) : '—'}</strong>
              </div>
            </>
          ) : (
            <p className="payment__hint">
              Collect {formatCurrency(total)} by {paymentMethodLabels[method]}, then confirm once the payment has gone through.
            </p>
          )}
          {error && <p className="admin-error" role="alert">{error}</p>}
          <div className="admin-form__actions">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={!canConfirm}>{isSubmitting ? 'Saving…' : `Confirm ${formatCurrency(total)}`}</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
