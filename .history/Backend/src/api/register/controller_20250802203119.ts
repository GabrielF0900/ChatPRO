//Algoritmo de registro de usuário

import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { gerarToken } from '../middlewares/criacaoToken.js'; 
import { guardarTokenNaReq } from '../middlewares/guardarTokenNaReq.js'; 
import prisma from '../prismaClient/prisma.js';


export async function registrarUsuario(req: Request, res: Response) {
    //Desestruturando os dados do usuário do corpo da requisição
    const { name, email, password } = req.body;

    // Verifica se todos os campos necessários estão presentes
    if (!aome || !email || !password) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    try {
        //Verificando se usuario já existe no banco de dados
        const usuarioExistente = await prisma.user.findUnique({
            where: { email }
        });

        if( usuarioExistente ) {
            return res.status(400).json({ erro: 'Usuário já existe' });
        }

        //Criptografando a senha
        const senhaCriptografada = await bcrypt.hash(password, 10);
        //Criando o usuário no banco de dados
        const novoUsuario = await prisma.user.create({
            data: {
                name: nome,
                email,
                password: senhaCriptografada
            }
        });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao registrar usuário' });
    }
}