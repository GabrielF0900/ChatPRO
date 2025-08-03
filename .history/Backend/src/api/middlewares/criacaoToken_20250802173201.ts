// middleware/gerarToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type JWTPayload = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export function gerarToken(req: Request, res: Response, next: NextFunction) {
  const { id, name, email, role } = req.body;

  if (!id || !name || !email) {
    return res.status(400).json({ erro: 'Dados do usuário ausentes' });
  }

  const payload: JWTPayload = { id, name, email, role };

  try {
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );
    res.locals.token = token;
    next();
  } catch (err) {
    console.error('Erro ao gerar token:', err);
    return res.status(500).json({ erro: 'Erro ao gerar token' });
  }
}
