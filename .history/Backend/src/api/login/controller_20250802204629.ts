//Algoritmo de login de usuário
import { Request, Response } from 'express';

export async function loginUsuario(req: Request, res: Response) {
    //Desestruturando os dados do corpo da requisição
    const { email, password } = req.body;

    //
}