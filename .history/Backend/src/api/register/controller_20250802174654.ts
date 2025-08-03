//Algoritmo de registro de usuário

import { Request, Response } from 'express';



import { gerarToken } from '../middlewares/criacaoToken.js'; 
import { guardarTokenNaReq } from '../middlewares/guardarTokenNaReq.js'; 