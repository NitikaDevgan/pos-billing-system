import { AppError } from "../../shared/errors/AppError.js";
import * as categoryRepository from "./category.repository.js";
import type { CategoryInput } from "./category.validator.js";

export const getCategories = async () => {
  return categoryRepository.getAllCategories();
};

export const createCategory = (input: CategoryInput) => categoryRepository.createCategory(input);

export const updateCategory = (id: string, input: CategoryInput) => categoryRepository.updateCategory(id, input);

export const deleteCategory = async (id: string) => {
  const productCount = await categoryRepository.countProducts(id);
  if (productCount > 0) throw new AppError(`Category still has ${productCount} product(s). Move or delete them first, or mark the category inactive.`, 409);
  await categoryRepository.deleteCategory(id);
};
