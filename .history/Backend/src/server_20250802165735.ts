import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor WebSocket rodando!");
});

import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor WebSocket rodando!");
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Armazenar conexões ativas
const clients = new Set<WebSocket>();

wss.on('connection', function connection(ws) {
  console.log('Nova conexão WebSocket estabelecida');
  clients.add(ws);
  
  // Enviar mensagem de boas-vindas
  ws.send(JSON.stringify({
    user: 'Sistema',
    message: 'Bem-vindo ao chat!',
    timestamp: new Date().toISOString()
  }));
  
  ws.on('message', function message(data) {
    try {
      const parsedData = JSON.parse(data.toString());
      console.log('Mensagem recebida:', parsedData);
      
      // Broadcast da mensagem para todos os clientes conectados
      clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            user: parsedData.user,
            message: parsedData.message,
            timestamp: parsedData.timestamp
          }));
        }
      });
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  });
  
  ws.on('close', function() {
    console.log('Conexão WebSocket fechada');
    clients.delete(ws);
  });
  
  ws.on('error', function(error) {
    console.error('Erro WebSocket:', error);
    clients.delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Chat disponível em: http://localhost:${PORT}`);
});
