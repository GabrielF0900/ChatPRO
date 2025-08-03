//Algoritmo de registro de usuário

import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { gerarToken } from '../middlewares/criacaoToken.js'; 
import { guardarTokenNaReq } from '../middlewares/guardarTokenNaReq.js'; 

export function registrarUsuario(req: Request, res: Response) {
    //Desestruturando os dados do usuário do corpo da requisição
    const { nome, email, password } = req.body;

    //
}