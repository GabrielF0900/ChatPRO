//Algoritmo de registro de usuário

import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { gerarToken } from '../middlewares/criacaoToken.js'; 
import { guardarTokenNaReq } from '../middlewares/guardarTokenNaReq.js'; 