
import { WebSocketServer } from 'ws';
import type { Server } from 'http';

// Função para inicializar o WebSocket no servidor HTTP
export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🔗 Nova conexão WebSocket estabelecida');
    ws.send(JSON.stringify({ type: 'system', message: 'Conectado ao chat!' }));

    ws.on('message', (data) => {
      try {
        // Converter Buffer para string se necessário
        const messageString = data.toString();
        console.log('📨 Mensagem recebida no servidor:', messageString);
        
        // Parse para verificar os dados
        const parsedData = JSON.parse(messageString);
        console.log('📋 Dados parseados:', parsedData);
        console.log('👥 Total de clientes conectados:', wss.clients.size);
        
        // Broadcast para todos os clientes conectados
        let clientesNotificados = 0;
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            console.log('📤 Enviando para cliente:', clientesNotificados + 1);
            client.send(messageString);
            clientesNotificados++;
          }
        });
        
        console.log('✅ Mensagem enviada para', clientesNotificados, 'clientes');
      } catch (error) {
        console.error('❌ Erro ao processar mensagem:', error);
      }
    });

    ws.on('close', () => {
      console.log('Conexão WebSocket fechada');
    });

    ws.on('error', (error) => {
      console.error('Erro WebSocket:', error);
    });
  });
}