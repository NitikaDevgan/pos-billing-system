import { categoryRepository } from './category.repository.js';
export const categoryService = { list: () => categoryRepository.findAll() };
