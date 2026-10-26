import { storeInfo } from '../../../config/store';
import { paymentMethodLabels, type Order } from '../../orders/types';

const money = (value: string | number) => Number(value).toFixed(2);

export function Receipt({ order }: { order: Order }) {
  const printedAt = new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="receipt">
      <header className="receipt__header">
        <strong className="receipt__store">{storeInfo.name}</strong>
        {storeInfo.addressLines.map((line) => <span key={line}>{line}</span>)}
        {storeInfo.phone && <span>Ph: {storeInfo.phone}</span>}
        {storeInfo.gstin && <span>GSTIN: {storeInfo.gstin}</span>}
      </header>
      <div className="receipt__meta">
        <span>Bill No: {order.billNumber}</span>
        <span>{printedAt}</span>
      </div>
      <table className="receipt__items">
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amt</th></tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{money(item.unitPrice)}</td>
              <td>{money(item.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="receipt__totals">
        <div><span>Items</span><span>{itemCount}</span></div>
        <div><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
        <div className="receipt__grand"><span>TOTAL ₹</span><span>{money(order.total)}</span></div>
        <div><span>Paid by</span><span>{paymentMethodLabels[order.paymentMethod]}</span></div>
        {order.amountReceived !== null && <div><span>Cash received</span><span>{money(order.amountReceived)}</span></div>}
        {order.changeDue !== null && <div><span>Change</span><span>{money(order.changeDue)}</span></div>}
      </div>
      <footer className="receipt__footer">{storeInfo.footer}</footer>
    </div>
  );
}
