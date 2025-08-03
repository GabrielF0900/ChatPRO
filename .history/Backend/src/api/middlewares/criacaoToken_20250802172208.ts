// utils/criarToken.ts
import jwt from 'jsonwebtoken';

interface Payload {
  id: string;
  name: string;
  email: string;
}

export function criarToken(payload: Payload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' },
      (err, token) => {
        if (err || !token) {
          return reject(new Error('Erro ao gerar token'));
        }
        resolve(token);
        console.log('Token gerado com sucesso:', token);
        next();
      }
    );
  });
}
