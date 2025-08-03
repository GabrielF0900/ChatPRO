import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Mensagem enviada:", message);
    setMessage("");
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
          <div></div>
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
          {/* Mensagem recebida */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="flex flex-col">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm max-w-md">
                <p className="text-gray-900">Olá! Como vocês estão?</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 ml-1">Ana Silva há 5 minutos</span>
            </div>
          </div>

          {/* Mensagem própria */}
          <div className="flex justify-end">
            <div className="flex flex-col items-end">
              <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-md shadow-sm max-w-md">
                <p>Oi Ana! Tudo bem por aqui, trabalhando no novo projeto.</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 mr-1">há 4 minutos</span>
            </div>
          </div>

          {/* Mensagem recebida */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">C</span>
            </div>
            <div className="flex flex-col">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm max-w-md">
                <p className="text-gray-900">Que legal! Precisa de ajuda com alguma coisa?</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 ml-1">Carlos Santos há 3 minutos</span>
            </div>
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="border-t p-4 flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Enviar
          </button>
        </form>
      </main>
    </div>
  );
}
