//Algoritmo de armazenamento do token na requisição
import { Request, Response, NextFunction } from 'express';


export function guardarTokenNaReq(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    //
}