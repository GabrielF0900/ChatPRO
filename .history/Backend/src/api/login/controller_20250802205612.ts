//Algoritmo de login de usuário
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient/prisma.js';


export async function loginUsuario(req: Request, res: Response) {
    //Desestruturando os dados do corpo da requisição
    const { email, password } = req.body;

    //Verificando se os campos obrigatórios estão preenchidos
    if (!email || !password) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    //Buscando o usuário no banco de dados
    try {
        const usuario = await prisma.user.findUnique({
            where: { email },
        });

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(password, usuario.password);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        //Retorna os dados do usuário sem a senha
        return res.status(200).json({
            mensagem: 'Login bem-sucedido',

        return res.status(200).json({ mensagem: 'Login bem-sucedido', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ erro: 'Erro ao fazer login' });
    }
}