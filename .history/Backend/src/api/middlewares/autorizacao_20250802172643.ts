// Middleware de autorização

//O middleware de autorização cuida das permissoes de acesso das rotas.

import { Request, Response, NextFunction } from 'express';

export function autorizacao(req: Request, res: Response, next: NextFunction) {
    // Verifica se o usuário está autenticado
    const token = req.headers['x-access-token'];

    // Se o token não estiver presente, retorna erro 401
    if (!token) {
        return res.status(401).json({ erro: 'Acesso não autorizado. Token ausente.' });
    }

    try {
        // Verifica se o token é válido (exemplo simples)
        if (token !== 'token_valido') {
            return res.status(403).json({ erro: 'Acesso não autorizado. Token inválido.' });
        }
        next(); // Chama o próximo middleware
    } catch (error) {
        
    }
}