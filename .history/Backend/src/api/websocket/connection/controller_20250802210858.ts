//Algoritmo que cuidará da conexão com usuarios via WebSocket
import express from 'express';

import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware

const httpServer = createServer(app);

// Função para inicializar o WebSocket no servidor HTTP
export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'system', message: 'Conectado ao chat!' }));

    ws.on('message', (data) => {
      // Broadcast para todos os clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(data);
        }
      });
    });

    ws.on('close', () => {
      // Lógica para desconexão, se necessário
    });
  });
}

wss.on("connection", (ws) => {
    console.log("Nova conexão WebSocket estabelecida");
    // Enviar mensagem de boas-vindas
    ws.send(JSON.stringify({
        message: "Bem-vindo ao servidor Chat Pro!"
    }));
});

wss.on("desconnection", (ws) => {
    console.log("Conexão WebSocket fechada");
});

// Gerenciar conexões WebSocket

wss.on("connection", (ws) => {
    console.log("Nova conexão WebSocket estabelecida");
    // Enviar mensagem de boas-vindas
    ws.send(JSON.stringify({
        message: "Bem-vindo ao servidor Chat Pro!"
    }));
});

wss.on("desconnection", (ws) => {
    console.log("Conexão WebSocket fechada");
})