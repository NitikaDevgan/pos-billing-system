import { productRepository } from './product.repository.js';
import type { ProductInput } from './product.validator.js';
export const productService = {
  list: () => productRepository.findAll(),
  create: (input: ProductInput) => productRepository.create(input),
  update: (id: string, input: ProductInput) => productRepository.update(id, input),
  remove: (id: string) => productRepository.delete(id),
};
