import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  type: 'system' | 'message';
  user?: string;
  message: string;
  timestamp: string;
  isOwn?: boolean;
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conectar ao WebSocket quando o componente monta
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:5000');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Conectado ao WebSocket');
          setConnectionStatus('connected');
        };

        ws.onmessage = async (event) => {
          try {
            let messageData;
            
            // Se a mensagem é um Blob, converte para texto
            if (event.data instanceof Blob) {
              messageData = await event.data.text();
            } else {
              messageData = event.data;
            }
            
            const data = JSON.parse(messageData);
            const newMessage: Message = {
              id: Date.now().toString(),
              type: data.type || 'message',
              user: data.user || 'Sistema',
              message: data.message,
              timestamp: data.timestamp || new Date().toISOString(),
              isOwn: false
            };
            setMessages(prev => [...prev, newMessage]);
          } catch (error) {
            console.error('Erro ao processar mensagem:', error);
          }
        };

        ws.onclose = () => {
          console.log('Conexão WebSocket fechada');
          setConnectionStatus('disconnected');
          // Tentar reconectar após 3 segundos
          setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (error) => {
          console.error('Erro WebSocket:', error);
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
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!message.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      // Gerar ID único para a mensagem
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Enviar mensagem via WebSocket com ID
      const messageData = {
        id: messageId,
        type: 'message',
        user: 'Você',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        senderId: 'current_user' // Identificador do usuário atual
      };

      wsRef.current.send(JSON.stringify(messageData));

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
