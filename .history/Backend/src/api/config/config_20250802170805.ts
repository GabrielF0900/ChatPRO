//Configurando JWT para autenticação e autorização

export const JWTConfig = {
    secret: process.env.JWT_SECRET,
}

export default JWTConfig;