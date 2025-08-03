//Algoritmo para cuidar das rotas da API

import express from 'express';
import { autenticacao } from '../middlewares/autenticacao.js';
import { autorizacao } from '../middlewares/autorizacao.js';
import { registrarUsuario } from '../register/controller.js';
import { loginUsuario } from '../login/controller.js';
import { gerarToken } from '../middlewares/criacaoToken.js';
import { guardarTokenNaReq } from '../middlewares/guardarTokenNaReq.js';


const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login',gerarToken,guardarTokenNaReq(req, res, next) loginUsuario);

export default router;
