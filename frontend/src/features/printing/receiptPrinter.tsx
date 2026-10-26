import { createPortal } from 'react-dom';
import type { Order } from '../orders/types';
import { Receipt } from './components/Receipt';

/**
 * Everything that prints bills goes through this interface. Today it uses the browser's
 * print dialog; to integrate a thermal printer later (ESC/POS over QZ Tray, WebUSB, or a
 * backend print endpoint), add another implementation and point `receiptPrinter` at it.
 */
export interface ReceiptPrinter {
  print: (order: Order) => Promise<void>;
}

const browserPrinter: ReceiptPrinter = {
  // The receipt is already in the DOM via <ReceiptPrintArea>; print CSS hides everything else.
  print: async () => window.print(),
};

export const receiptPrinter: ReceiptPrinter = browserPrinter;

/** Off-screen copy of the receipt that only becomes visible when the page is printed. */
export function ReceiptPrintArea({ order }: { order: Order }) {
  return createPortal(<div className="print-area"><Receipt order={order} /></div>, document.body);
}
