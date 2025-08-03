//Algoritmo de criação de token JWT
//O algoritmo de criação de token JWT é responsável por gerar tokens de autenticação para os usuários

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const criarToken = (req: Request, res: Response, next: NextFunction): Promise<string> => {
    return new Promise((resolve, reject) => {
        //Recuperando os dados do usuario
        const {id, name, email} = req.body;
        //Verificando se os dados do usuário estão presentes
        if (!id || !name || !email) {
            return reject(new Error('Dados do usuário ausentes'));
        }
        //Criando o payload do token
        const payload = {
            id,
            name,
            email
        };
        //Gerando o token JWT
        jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' }, (err, token) => {
            if (err) {
                return reject(new Error('Erro ao gerar token'));
            }
            resolve(token);
        });
    });
};
