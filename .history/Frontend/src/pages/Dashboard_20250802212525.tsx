import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    console.log("Mensagem enviada:", message);
    setMessage("");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 bg-white border-r flex-shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">ChatPro</h2>
          <p className="text-sm text-gray-500">Chat colaborativo em tempo real</p>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-112px)]">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Online (3)</h3>
            <ul className="space-y-2">
              {[
                { name: "Ana Silva", status: "Online", color: "green", icon: "A" },
                { name: "Carlos Santos", status: "Online", color: "green", icon: "C" },
                { name: "Pedro Lima", status: "Online", color: "green", icon: "P" },
              ].map((user) => (
                <li key={user.name} className="flex items-center gap-3 p-2 border rounded-md">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {user.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <span className="text-xs text-green-600">{user.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Ausente (1)</h3>
            <ul>
              <li className="flex items-center gap-3 p-2 border rounded-md">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold">
                  M
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Maria Oliveira</p>
                  <span className="text-xs text-yellow-600">Ausente</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Offline (1)</h3>
            <ul>
              <li className="flex items-center gap-3 p-2 border rounded-md">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 font-semibold">
                  J
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">João Costa</p>
                  <span className="text-xs text-gray-500">Offline</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Chat */}
      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-6 py-4 border-b">
          <div></div>
          <div className="text-right">
            <p className="text-sm text-gray-700 font-medium">Bem-vindo, Você!</p>
            <p className="text-xs text-green-600">Online agora</p>
          </div>
        </header>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 px-4 py-2 rounded-lg max-w-md">
              <p>Olá! Como vocês estão?</p>
            </div>
            <span className="self-end text-xs text-gray-500">Ana Silva há 5 minutos</span>
          </div>

          <div className="flex justify-end items-start gap-3">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-md">
              <p>Oi Ana! Tudo bem por aqui, trabalhando no novo projeto.</p>
            </div>
            <span className="self-end text-xs text-gray-500">há 4 minutos</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-gray-100 px-4 py-2 rounded-lg max-w-md">
              <p>Que legal! Precisa de ajuda com alguma coisa?</p>
            </div>
            <span className="self-end text-xs text-gray-500">Carlos Santos há 3 minutos</span>
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
