import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import routes from './api/routes/routes.js';
import { setupWebSocket } from './api/websocket/connection/controller.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use('/api', routes);

// Rota básica
app.get('/', (req, res) => {
  res.send('Servidor WebSocket rodando!');
});

// Criar servidor HTTP
const server = createServer(app);

// Configurar WebSocket usando sua função
setupWebSocket(server);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`WebSocket disponível em ws://localhost:${PORT}`);
});