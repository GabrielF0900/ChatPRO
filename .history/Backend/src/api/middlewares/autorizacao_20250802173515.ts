//Algoritmo de autorizacao de acesso
import { Request, Response, NextFunction } from 'express';

export function autorizacao(req: Request, res: Response, next: NextFunction) {
    // Pegando o token do middleware guardarTokenNaReq
    const token = req.token;

    //Verificando se o token existe
    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

}