import express from 'express';
import { loginUsuario } from '../login/controller.js';
import { gerarToken } from '../middlewares/criacaoToken.js';
import { guardarTokenNaReq } from '../middlewares/guardarTokenNaReq.js';
import { registrarUsuario } from '../register/controller.js';


const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario, gerarToken, guardarTokenNaReq);

export default router;
