import express from 'express';

import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import 

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });


// Gerenciar mensagens WebSocket

wss.on("message", (mensagem) => {
    console.log("Mensagem recebida:", mensagem);
});