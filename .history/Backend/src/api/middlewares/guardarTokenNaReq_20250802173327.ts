// Middleware para extrair e armazenar o token JWT da requisição
import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    token?: string;
  }
}

export function guardarTokenNaReq(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ erro: 'Header de autorização não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  // Validação simples do formato JWT (opcional)
  if (token.split('.').length !== 3) {
    return res.status(400).json({ erro: 'Token JWT mal formatado' });
  }

  req.token = token;
  next();
}