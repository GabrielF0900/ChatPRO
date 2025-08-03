//Algoritmo de login de usuário
import { Request, Response } from 'express';

export async function loginUsuario(req: Request, res: Response) {
    //Desestruturando os dados do corpo da requisição
    const { email, password } = req.body;

    //Verificando se os campos obrigatórios estão preenchidos
    if (!email || !password) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    //Buscando o usuário no banco de dados
}