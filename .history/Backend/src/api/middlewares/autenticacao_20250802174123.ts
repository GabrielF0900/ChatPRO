//Middleware de autenticação

//Esse middleware verifica se o usuario é quem ele diz ser.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function autenticacao(req: Request, res: Response, next: NextFunction) {
    // Extrair o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    // Verificar se o token está presente
    if (!authHeader) {}
}