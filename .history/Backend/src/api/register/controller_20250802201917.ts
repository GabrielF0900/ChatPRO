//Algoritmo de registro de usuário

import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { gerarToken } from '../middlewares/criacaoToken.js'; 
import { guardarTokenNaReq } from '../middlewares/guardarTokenNaReq.js'; 
import prisma from '../prismaClient/prisma.js';


export function registrarUsuario(req: Request, res: Response) {
    //Desestruturando os dados do usuário do corpo da requisição
    const { nome, email, password } = req.body;

    // Verifica se todos os campos necessários estão presentes
    if (!nome || !email || !password) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    try {
        //Verificando se usuario já existe no banco de dados
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { email }
    } catch (error) {
        
    }
}