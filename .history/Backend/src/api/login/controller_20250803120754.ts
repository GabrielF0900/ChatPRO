import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prismaClient/prisma.js';

export async function loginUsuario(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    const usuario = await prisma.user.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    // Guardar usuário na requisição
    req.user = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.name,
      role: usuario.role,
    };

    next(); // Continua para os próximos middlewares
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
}
