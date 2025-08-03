import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'system' | 'message';
  user?: string;
  message: string;
  timestamp: string;
  isOwn?: boolean;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Rastrear IDs de mensagens já processadas para evitar duplicação
  const processedMessageIds = useRef<Set<string>>(new Set());
  
  // Obter dados do usuário logado - OTIMIZADO com useMemo
  const currentUser = useMemo(() => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log('📱 Dados brutos do localStorage:', storedUser);
      const parsed = storedUser ? JSON.parse(storedUser) : {};
      console.log('📱 Dados parseados do usuário:', parsed);
      return parsed;
    } catch (error) {
      console.error('Erro ao ler dados do usuário:', error);
      return {};
    }
  }, []); // Executar apenas uma vez
  
  const userEmail = useMemo(() => {
    return currentUser.email || `anonimo_${Date.now()}`;
  }, [currentUser.email]);

  console.log('👤 Dados do usuário atual:', { currentUser, userEmail });

  // Verificar se o usuário está logado - OTIMIZADO
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !currentUser.email) {
      console.log('Usuário não está logado, redirecionando...');
      navigate('/login');
      return;
    }
  }, []); // Executar apenas uma vez na montagem

  // Conectar ao WebSocket quando o componente monta
  useEffect(() => {
    console.log('🔄 useEffect executado para conectar WebSocket');
    
    // Verificar se temos um usuário válido
    if (!userEmail) {
      console.log('⚠️ UserEmail não disponível, aguardando...');
      return;
    }
    
    // Se já existe uma conexão ativa, não criar outra
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('⚠️ WebSocket já conectado, pulando criação');
      return;
    }

    const connectWebSocket = () => {
      try {
        console.log('🔌 Criando nova conexão WebSocket para:', userEmail);
        
        // Fechar conexão anterior se existir
        if (wsRef.current) {
          wsRef.current.close();
        }

        const ws = new WebSocket('ws://localhost:5000');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('✅ WebSocket conectado para:', userEmail);
          setConnectionStatus('connected');
        };

        ws.onmessage = async (event) => {
          console.log('🔔 Mensagem recebida via WebSocket');
          try {
            let messageData;
            
            // Se a mensagem é um Blob, converte para texto
            if (event.data instanceof Blob) {
              messageData = await event.data.text();
            } else {
              messageData = event.data;
            }
            
            const data = JSON.parse(messageData);
            console.log('📋 Dados completos da mensagem recebida:', data);
            console.log('👤 Meu email atual:', userEmail);
            console.log('📧 Email do remetente:', data.senderId);
            console.log('🔍 São iguais?', data.senderId === userEmail);
            
            // Verificar se a mensagem já foi processada
            if (data.id && processedMessageIds.current.has(data.id)) {
              console.log('⚠️ Mensagem já processada, ignorando ID:', data.id);
              return;
            }
            
            // Ignorar mensagens enviadas pelo próprio usuário
            if (data.senderId && data.senderId === userEmail) {
              console.log('⚠️ É minha própria mensagem, ignorando');
              return;
            }
            
            // Adicionar ID à lista de processados
            if (data.id) {
              processedMessageIds.current.add(data.id);
              console.log('✅ ID adicionado aos processados:', data.id);
            }
            
            const newMessage: Message = {
              id: data.id || `received_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: data.type || 'message',
              user: data.user || 'Sistema',
              message: data.message,
              timestamp: data.timestamp || new Date().toISOString(),
              isOwn: false
            };
            
            console.log('✅ Adicionando nova mensagem de:', data.user, '- Mensagem:', data.message);
            setMessages(prev => [...prev, newMessage]);
          } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
          }
        };

        ws.onclose = () => {
          console.log('❌ WebSocket fechado para:', userEmail);
          setConnectionStatus('disconnected');
          // Tentar reconectar após 3 segundos apenas se não foi fechado intencionalmente
          if (wsRef.current === ws) {
            setTimeout(() => connectWebSocket(), 3000);
          }
        };

        ws.onerror = (error) => {
          console.error('💥 Erro WebSocket para', userEmail, ':', error);
          setConnectionStatus('disconnected');
        };
      } catch (error) {
        console.error('Erro ao conectar WebSocket:', error);
        setConnectionStatus('disconnected');
      }
    };

    connectWebSocket();

    // Cleanup ao desmontar o componente
    return () => {
      console.log('🧹 Limpando WebSocket na desmontagem');
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [userEmail]); // Manter userEmail como dependência, mas agora com proteção contra múltiplas conexões

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('Tentando enviar mensagem:', {
      message: message.trim(),
      wsConnection: wsRef.current?.readyState,
      userEmail,
      currentUser
    });
    
    if (!message.trim()) {
      console.log('Mensagem vazia, não enviando');
      return;
    }
    
    if (!wsRef.current) {
      console.log('WebSocket não conectado');
      return;
    }
    
    if (wsRef.current.readyState !== WebSocket.OPEN) {
      console.log('WebSocket não está aberto. Estado:', wsRef.current.readyState);
      return;
    }

    try {
      // Gerar ID único para a mensagem
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Enviar mensagem via WebSocket com ID
      const messageData = {
        id: messageId,
        type: 'message',
        user: currentUser.name || 'Usuário',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        senderId: userEmail // Usar email como identificador único
      };

      console.log('Enviando dados via WebSocket:', messageData);
      console.log('🚀 Enviando mensagem via WebSocket para:', userEmail);
      console.log('📡 Dados da mensagem:', messageData);
      
      wsRef.current.send(JSON.stringify(messageData));
      
      console.log('✅ Mensagem enviada com sucesso!');

      // Adicionar ID à lista de processados para evitar duplicação
      processedMessageIds.current.add(messageId);

      // Adicionar mensagem própria à lista
      const ownMessage: Message = {
        id: messageId,
        type: 'message',
        user: 'Você',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        isOwn: true
      };

      setMessages(prev => [...prev, ownMessage]);
      setMessage("");
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header do Chat */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ChatPro</h1>
              <p className="text-sm text-gray-500">Chat colaborativo em tempo real</p>
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Usuários Conectados</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">5</span>
            </div>
            
            <div className="space-y-3">
              <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online (3)
              </div>
              
              {[
                { name: "Ana Silva", initial: "A", color: "bg-blue-500" },
                { name: "Carlos Santos", initial: "C", color: "bg-green-500" },
                { name: "Pedro Lima", initial: "P", color: "bg-purple-500" },
              ].map((user) => (
                <div key={user.name} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className={`w-8 h-8 ${user.color} rounded-full flex items-center justify-center relative`}>
                    <span className="text-white text-sm font-medium">{user.initial}</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-green-600">Online</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs font-medium text-yellow-600 flex items-center gap-1 mb-3">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Ausente (1)
            </div>
            
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center relative">
                <span className="text-white text-sm font-medium">M</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Maria Oliveira</p>
                <p className="text-xs text-yellow-600">Ausente</p>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-3">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Offline (1)
            </div>
            
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer opacity-60">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">J</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">João Costa</p>
                <p className="text-xs text-gray-500">Offline</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat Principal */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Header do Chat */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Chat Geral</h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-500">
                {connectionStatus === 'connected' ? 'Conectado' : 
                 connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Bem-vindo, Você!</p>
              <p className="text-xs text-green-600">Online agora</p>
            </div>
            <button 
              onClick={() => {
                console.log('� Limpando localStorage e forçando re-login');
                localStorage.clear();
                navigate('/login');
              }}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Limpar
            </button>
            <button 
              onClick={() => {
                console.log('�🧪 Teste de conexão WebSocket');
                console.log('📊 Estado da conexão:', wsRef.current?.readyState);
                console.log('👤 Usuário atual:', userEmail);
                console.log('📱 Mensagens atuais:', messages.length);
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                  const testMessage = {
                    id: `test_${Date.now()}`,
                    type: 'message',
                    user: currentUser.name || 'Teste',
                    message: '🧪 Mensagem de teste',
                    timestamp: new Date().toISOString(),
                    senderId: userEmail
                  };
                  wsRef.current.send(JSON.stringify(testMessage));
                  console.log('✅ Mensagem de teste enviada');
                } else {
                  console.log('❌ WebSocket não está conectado');
                }
              }}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Teste
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Sair
            </button>
          </div>
        </header>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg font-medium">Nenhuma mensagem ainda</p>
              <p className="text-sm">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          ) : (
            messages.map((msg) => {
              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                      {msg.message}
                    </div>
                  </div>
                );
              }

              if (msg.isOwn) {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="flex flex-col items-end">
                      <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-md shadow-sm max-w-md">
                        <p>{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 mr-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {msg.user?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm max-w-md">
                        <p className="text-gray-900">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 ml-1">
                        {msg.user} - {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              }
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Mensagem */}
        <form
          onSubmit={handleSend}
          className="border-t border-gray-200 p-4 bg-white"
        >
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={connectionStatus === 'connected' ? "Digite sua mensagem..." : "Aguardando conexão..."}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={connectionStatus !== 'connected'}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button type="button" className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
                <button type="button" className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-2">{message.length}/1000 caracteres</div>
            </div>
            <button
              type="submit"
              disabled={!message.trim() || connectionStatus !== 'connected'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors duration-200 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Enviar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
