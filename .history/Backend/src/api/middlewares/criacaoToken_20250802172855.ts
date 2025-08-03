// middleware/gerarToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function gerarToken(req: Request, res: Response, next: NextFunction) {
  const { id, name, email } = req.body;

  if (!id || !name || !email) {
    return res.status(400).json({ erro: 'Dados do usuário ausentes' });
  }

  const payload = { id, name, email, role };

  jwt.sign(
    payload,
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1h' },
    (err, token) => {
      if (err || !token) {
        return res.status(500).json({ erro: 'Erro ao gerar token' });
      }

      req.body.token = token; // adiciona o token ao request
      next(); // chama o próximo middleware
    }
  );
}
