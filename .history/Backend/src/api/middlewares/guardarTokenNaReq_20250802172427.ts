//Algoritmo de armazenamento do token na requisição
import { Request, Response, NextFunction } from 'express';


export function guardarTokenNaReq(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    // Verifica se o token está presente
    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }
}