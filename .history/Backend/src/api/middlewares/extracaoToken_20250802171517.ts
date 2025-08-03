//Algoritmo de extração de token

import { Request, Response, NextFunction } from 'express';

export const extracaoToken = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return new Promise((resolve, reject) => {
        //desestruturando o token do cabeçalho de autorização
        const { authorization } = req.headers;
        //Verificando se o token existe
        if (!authorization) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        try {
            //Extraindo o token do cabeçalho da requisição
        } catch (error) {
            
        }
    })
}