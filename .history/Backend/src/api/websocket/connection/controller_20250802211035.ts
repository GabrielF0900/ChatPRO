
import { WebSocketServer } from 'ws';
import type { Server } from 'http';

// Função para inicializar o WebSocket no servidor HTTP
export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Nova conexão WebSocket estabelecida');
    ws.send(JSON.stringify({ type: 'system', message: 'Conectado ao chat!' }));

    ws.on('message', (data) => {
      // Broadcast para todos os clientes conectados
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(data);
        }
      });
    });

    ws.on('close', () => {
      console.log('Conexão WebSocket fechada');
    });

    ws.on('error', (error) => {
      console.error('Erro WebSocket:', error);
    });
  });
}