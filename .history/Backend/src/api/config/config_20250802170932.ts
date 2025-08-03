//Configurando JWT para autenticação e autorização

export const JWTConfig = {
    secret: process.env.JWT_SECRET,
    expireIn: process.env.EXPIRATION_TIME || '7d',
}

export default JWTConfig;