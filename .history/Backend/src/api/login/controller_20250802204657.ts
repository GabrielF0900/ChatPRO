//Algoritmo de login de usuário
import { Request, Response } from 'express';

export async function loginUsuario(req: Request, res: Response) {
    //Desestruturando os dados do corpo da requisição
    const { email, password } = req.body;

    //Verificando se os campos obrigatórios estão preenchidos
    if (!email || !password) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    //Buscando o usuário no banco de dados
    try {
        const usuario = await prisma.user.findUnique({
            where: { email },
        });

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(password, usuario.password);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return res.status(200).json({ mensagem: 'Login bem-sucedido', token });
    } catch (error) {
        
    }
}