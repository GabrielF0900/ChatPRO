//Algoritmo de autorizacao de acesso
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function autorizacao(req: Request, res: Response, next: NextFunction) {
    // Pegando o token do middleware guardarTokenNaReq
    const token = req.token;

    //Verificando se o token existe
    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    try {
        //Verificando se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        // Garante que decoded é um objeto JwtPayload
        if (typeof decoded === 'object' && (decoded as JwtPayload).role !== 'admin') {
            return res.status(403).json({ erro: 'Acesso negado' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido' });
    }
}