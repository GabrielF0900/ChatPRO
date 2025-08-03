//Algoritmo que cuidará da conexão com usuarios via WebSocket
import express from 'express';

import { createServer } from 'http';
import {Server} from 'ws';

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware

const httpServer = createServer(app);
