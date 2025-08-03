// controller.js
export async function registrarUsuario(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    try {
        const usuarioExistente = await prisma.user.findUnique({
            where: { email }
        });

        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Usuário já existe' });
        }

        const senhaCriptografada = await bcrypt.hash(password, 10);

        const novoUsuario = await prisma.user.create({
            data: {
                name,
                email,
                password: senhaCriptografada
            }
        });

        return res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: novoUsuario });

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return res.status(500).json({ erro: 'Erro ao registrar usuário' });
    }
}
