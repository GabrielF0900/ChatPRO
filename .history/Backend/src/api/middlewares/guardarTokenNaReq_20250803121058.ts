import { Response } from 'express';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';

export function guardarTokenNaReq(req: AuthenticatedRequest, res: Response) {
  if (!req.user || !req.token) {
    return res.status(500).json({ erro: 'Dados de autenticação ausentes' });
  }

  return res.status(200).json({
    mensagem: 'Login bem-sucedido',
    usuario: req.user,
    token: req.token,
  });
}
