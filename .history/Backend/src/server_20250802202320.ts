import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import routes from './api/routes/routes.js';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rota básica
app.get('/', (req, res) => {
  res.send('Servidor WebSocket rodando!');
});

// Criar servidor HTTP
const server = createServer(app);

// Criar servidor WebSocket
const wss = new WebSocketServer({ server });

// Gerenciar conexões WebSocket
wss.on('connection', (ws) => {
  console.log('Nova conexão WebSocket estabelecida');

  // Enviar mensagem de boas-vindas
  ws.send(JSON.stringify({
    type: 'system',
    message: 'Conectado ao chat!'
  }));

  // Escutar mensagens do cliente
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Mensagem recebida:', message);

      // Broadcast da mensagem para todos os clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: 'message',
            user: message.user || 'Anônimo',
            message: message.message,
            timestamp: new Date().toISOString()
          }));
        }
      });
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  });

  // Tratar desconexão
  ws.on('close', () => {
    console.log('Conexão WebSocket fechada');
  });

  // Tratar erros
  ws.on('error', (error) => {
    console.error('Erro WebSocket:', error);
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`WebSocket disponível em ws://localhost:${PORT}`);
});