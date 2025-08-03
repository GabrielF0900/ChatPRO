//Algoritmo que cuidará da conexão com usuarios via WebSocket
import express from 'express';

import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

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
}