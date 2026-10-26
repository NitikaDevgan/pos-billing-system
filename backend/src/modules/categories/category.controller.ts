import { Request, Response, NextFunction } from "express";
import * as categoryService from "./category.service.js";


export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryService.getCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ success: true, data: await categoryService.createCategory(req.body) });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, data: await categoryService.updateCategory(req.params.id, req.body) });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
