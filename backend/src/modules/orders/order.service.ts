import { Prisma } from '@prisma/client';
import { AppError } from '../../shared/errors/AppError.js';
import { orderRepository } from './order.repository.js';
import type { OrderInput } from './order.validator.js';

export const orderService = {
  async create({ items, paymentMethod, amountReceived }: OrderInput) {
    // Merge duplicate lines so the same product can't appear twice on a bill.
    const quantities = new Map<string, number>();
    for (const item of items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);

    const products = await orderRepository.findProducts([...quantities.keys()]);
    const productsById = new Map(products.map((product) => [product.id, product]));

    const lines = [...quantities].map(([productId, quantity]) => {
      const product = productsById.get(productId);
      if (!product) throw new AppError('One of the items is no longer on the menu. Refresh and try again.', 400);
      if (!product.isActive || !product.category.isActive) throw new AppError(`${product.name} is currently unavailable.`, 400);
      return { product: { connect: { id: productId } }, name: product.name, unitPrice: product.price, quantity, lineTotal: product.price.mul(quantity) };
    });

    const subtotal = lines.reduce((sum, line) => sum.add(line.lineTotal), new Prisma.Decimal(0));
    const total = subtotal; // Taxes / discounts slot in here later.

    let cash: { amountReceived: Prisma.Decimal; changeDue: Prisma.Decimal } | undefined;
    if (paymentMethod === 'CASH') {
      if (amountReceived === undefined) throw new AppError('Enter the cash amount received.', 400);
      const received = new Prisma.Decimal(amountReceived);
      if (received.lessThan(total)) throw new AppError(`Cash received is less than the total of ₹${total.toFixed(2)}.`, 400);
      cash = { amountReceived: received, changeDue: received.sub(total) };
    }

    return orderRepository.create({ subtotal, total, paymentMethod, ...cash, items: { create: lines } });
  },
  async getById(id: string) {
    const order = await orderRepository.findById(id);
    if (!order) throw new AppError('Order not found', 404);
    return order;
  },
  list: (limit = 50) => orderRepository.findRecent(limit),
};
