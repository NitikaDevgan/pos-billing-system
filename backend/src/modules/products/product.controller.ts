import type { RequestHandler } from 'express';
import { productService } from './product.service.js';
export const listProducts: RequestHandler = async (_request, response, next) => { try { response.json({ success: true, data: await productService.list() }); } catch (error) { next(error); } };
export const createProduct: RequestHandler = async (request, response, next) => { try { response.status(201).json({ success: true, data: await productService.create(request.body) }); } catch (error) { next(error); } };
export const updateProduct: RequestHandler<{ id: string }> = async (request, response, next) => { try { response.json({ success: true, data: await productService.update(request.params.id, request.body) }); } catch (error) { next(error); } };
export const deleteProduct: RequestHandler<{ id: string }> = async (request, response, next) => { try { await productService.remove(request.params.id); response.status(204).end(); } catch (error) { next(error); } };
