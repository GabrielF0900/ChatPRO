
import { WebSocketServer } from 'ws';
import type { Server } from 'http';

// Mapa para rastrear conexões por usuário
const userConnections = new Map<string, Set<any>>();

// Função para inicializar o WebSocket no servidor HTTP
export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🔗 Nova conexão WebSocket estabelecida');
    console.log('👥 Total de conexões ativas:', wss.clients.size);
    
    ws.send(JSON.stringify({ type: 'system', message: 'Conectado ao chat!' }));

    // Armazenar o email do usuário quando a primeira mensagem for enviada
    let userEmail: string | null = null;

    ws.on('message', (data) => {
      try {
        // Converter Buffer para string se necessário
        const messageString = data.toString();
        console.log('📨 Mensagem recebida no servidor:', messageString);
        
        // Parse para verificar os dados
        const parsedData = JSON.parse(messageString);
        console.log('📋 Dados parseados:', parsedData);
        
        // Armazenar o email do usuário para rastreamento
        if (parsedData.senderId && !userEmail) {
          userEmail = parsedData.senderId;
          
          // Adicionar esta conexão ao mapa de usuários
          if (!userConnections.has(userEmail)) {
            userConnections.set(userEmail, new Set());
          }
          userConnections.get(userEmail)!.add(ws);
          
          console.log('� Usuário registrado:', userEmail);
          console.log('🔢 Conexões deste usuário:', userConnections.get(userEmail)!.size);
        }
        
        console.log('👥 Total de conexões WebSocket:', wss.clients.size);
        console.log('👤 Usuários únicos conectados:', userConnections.size);
        
        // Broadcast para todos os clientes conectados EXCETO o remetente
        let clientesNotificados = 0;
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            clientesNotificados++;
            console.log('📤 Enviando para cliente:', clientesNotificados);
            client.send(messageString);
          }
        });
        
        console.log('✅ Mensagem enviada para', clientesNotificados, 'clientes (excluindo remetente)');
      } catch (error) {
        console.error('❌ Erro ao processar mensagem:', error);
      }
    });

    ws.on('close', () => {
      console.log('🔌 Conexão WebSocket fechada');
      
      // Remover esta conexão do mapa de usuários
      if (userEmail && userConnections.has(userEmail)) {
        const userSet = userConnections.get(userEmail)!;
        userSet.delete(ws);
        
        // Se não há mais conexões para este usuário, remover do mapa
        if (userSet.size === 0) {
          userConnections.delete(userEmail);
          console.log('👤 Usuário', userEmail, 'desconectado completamente');
        } else {
          console.log('👤 Usuário', userEmail, 'ainda tem', userSet.size, 'conexões ativas');
        }
      }
      
      console.log('👥 Conexões restantes:', wss.clients.size);
      console.log('👤 Usuários únicos conectados:', userConnections.size);
    });

    ws.on('error', (error) => {
      console.error('💥 Erro WebSocket no servidor:', error);
      
      // Limpar conexão com erro do mapa
      if (userEmail && userConnections.has(userEmail)) {
        userConnections.get(userEmail)!.delete(ws);
      }
    });
  });
}