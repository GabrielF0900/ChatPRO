//Estendendo a tipagem do express para incluir o usuário autenticado
import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
    };
}