//Algoritmo de registro de usuário

import { Request, Response } from 'express';

import { gerarToken } from '../middlewares/criacaoToken';
import { guardarTokenNaReq } from '../middlewares/guardarTokenNaReq';