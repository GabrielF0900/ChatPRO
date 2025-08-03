//Algoritmo de armazenamento do token na requisição
import { Request, Response, NextFunction } from 'express';

// Extensão opcional da interface Request para tipar req.token
declare module 'express-serve-static-core' {
  interface Request {
    token?: string;
  }
}

export function guardarTokenNaReq(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];

  // Verifica se o token está presente
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  req.token = token; // Armazena o token de forma segura
  next(); // Chama o próximo middleware
}