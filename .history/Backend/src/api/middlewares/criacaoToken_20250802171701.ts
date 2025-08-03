//Algoritmo de criação de token JWT
//O algoritmo de criação de token JWT é responsável por gerar tokens de autenticação para os usuários

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

exort const criarToken