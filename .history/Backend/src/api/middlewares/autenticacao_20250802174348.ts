//Middleware de autenticação

//Esse middleware verifica se o usuario é quem ele diz ser.

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function autenticacao(req: Request, res: Response, next: NextFunction) {
    // Extrair o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    // Verificar se o token está presente
    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    //Pegando o token extraido e verificando a identidade do usuario pelo role
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        if (typeof decoded === 'object' && (decoded as JwtPayload).role !== 'admin') {
            return res.status(403).json({ erro: 'Acesso negado' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido' });
    }
}