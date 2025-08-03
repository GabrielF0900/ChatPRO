//Algoritmo de criação de token JWT
//O algoritmo de criação de token JWT é responsável por gerar tokens de autenticação para os usuários

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const criarToken = (req: Request, res: Response, next: NextFunction): Promise<string> => {
    return new Promise((resolve, reject) => {
        const { userId } = req.body;
        const secret = process.env.JWT_SECRET || 'default_secret';
        const token = jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
        resolve(token);
    });
};
