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

wss.on("connection", ())