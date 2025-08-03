//Algoritmo para cuidar das rotas da API

import express from 'express';
import { autenticacao } from '../middlewares/autenticacao.js';
import { autorizacao } from '../middlewares/autorizacao.js';
import { registrarUsuario } from '../register/controller.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        await registrarUsuario(req.body);
        res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return res.status(500).json({ erro: 'Erro ao registrar usuário' });
    }
});

export default router;
