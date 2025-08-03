import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Servir arquivo HTML do chat
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Chat WebSocket</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            #messages { border: 1px solid #ccc; height: 300px; overflow-y: scroll; padding: 10px; margin-bottom: 10px; }
            #messageInput { width: 70%; padding: 5px; }
            #sendButton { padding: 5px 10px; }
            .message { margin: 5px 0; }
            .user { font-weight: bold; color: #007bff; }
            .timestamp { font-size: 0.8em; color: #666; }
        </style>
    </head>
    <body>
        <h1>Chat em Tempo Real</h1>
        <div id="messages"></div>
        <input type="text" id="messageInput" placeholder="Digite sua mensagem..." />
        <button id="sendButton">Enviar</button>
        
        <script>
            const ws = new WebSocket('ws://localhost:3000');
            const messages = document.getElementById('messages');
            const messageInput = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            
            ws.onopen = function() {
                addMessage('Sistema', 'Conectado ao chat!', new Date());
            };
            
            ws.onmessage = function(event) {
                const data = JSON.parse(event.data);
                addMessage(data.user, data.message, new Date(data.timestamp));
            };
            
            ws.onclose = function() {
                addMessage('Sistema', 'Desconectado do chat.', new Date());
            };
            
            function addMessage(user, message, timestamp) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                messageDiv.innerHTML = 
                    '<span class="user">' + user + ':</span> ' + 
                    message + 
                    ' <span class="timestamp">(' + timestamp.toLocaleTimeString() + ')</span>';
                messages.appendChild(messageDiv);
                messages.scrollTop = messages.scrollHeight;
            }
            
            function sendMessage() {
                const message = messageInput.value.trim();
                if (message) {
                    ws.send(JSON.stringify({
                        user: 'Usuário',
                        message: message,
                        timestamp: new Date().toISOString()
                    }));
                    messageInput.value = '';
                }
            }
            
            sendButton.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        </script>
    </body>
    </html>
  `);
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Armazenar conexões ativas
const clients = new Set();

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
        if (client.readyState === 1) { // WebSocket.OPEN
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
