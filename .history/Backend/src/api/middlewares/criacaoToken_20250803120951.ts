import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function gerarToken(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user) {
    return res.status(500).json({ erro: 'Usuário não encontrado para gerar token' });
  }

  try {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    req.token = token;
    next();
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    res.status(500).json({ erro: 'Erro ao gerar token' });
  }
}
