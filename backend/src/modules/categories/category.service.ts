import * as categoryRepository from "./category.repository.js";

export const getCategories = async () => {
  return categoryRepository.getAllCategories();
};