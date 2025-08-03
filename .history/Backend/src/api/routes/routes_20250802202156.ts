//Algoritmo para cuidar das rotas da API

import express from 'express';
import { autenticacao } from '../middlewares/autenticacao.js';
import { autorizacao } from '../middlewares/autorizacao.js';
import { registrarUsuario } from '../register/controller.js';

const router = express.Router();

router.post('/register', registrarUsuario);

export default router;
