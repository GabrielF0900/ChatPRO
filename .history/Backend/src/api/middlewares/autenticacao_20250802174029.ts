//Middleware de autenticação

//Esse middleware verifica se o usuario é quem ele diz ser.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

