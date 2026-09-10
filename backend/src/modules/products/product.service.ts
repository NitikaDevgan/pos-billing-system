import { productRepository } from './product.repository.js';
export const productService = { list: () => productRepository.findAll() };
