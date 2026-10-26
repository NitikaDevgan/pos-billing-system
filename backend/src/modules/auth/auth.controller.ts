import type { RequestHandler } from 'express';
import { authService } from './auth.service.js';
export const login: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: await authService.login(request.body) }); } catch (error) { next(error); } };
export const getMe: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: await authService.me(request.user!.id) }); } catch (error) { next(error); } };
