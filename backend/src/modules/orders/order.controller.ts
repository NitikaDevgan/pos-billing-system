import type { RequestHandler } from 'express';
import { orderService } from './order.service.js';
export const createOrder: RequestHandler = async (request, response, next) => { try { response.status(201).json({ success: true, data: await orderService.create(request.body) }); } catch (error) { next(error); } };
export const getOrder: RequestHandler<{ id: string }> = async (request, response, next) => { try { response.json({ success: true, data: await orderService.getById(request.params.id) }); } catch (error) { next(error); } };
export const listOrders: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: await orderService.list(request.query.limit ? Number(request.query.limit) : undefined) }); } catch (error) { next(error); } };
