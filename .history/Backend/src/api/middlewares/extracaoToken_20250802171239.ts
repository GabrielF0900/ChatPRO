//Algoritmo de extração de token

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

exort async const extracaoToken = (req: Request, res: Response, next: NextFunction) <=> {