import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Registro bem-sucedido, navegar para login
        navigate('/login');
      } else {
        setError(data.message || 'Erro ao criar conta');
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-600 rounded-full p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 15h.008v.008H7.5V15zm3.75 0h.008v.008h-.008V15zm3.75 0h.008v.008H15V15zm1.5-6.75v6.375a.375.375 0 01-.375.375H7.875a.375.375 0 01-.375-.375V8.25m8.25 0A3.375 3.375 0 0012 4.875 3.375 3.375 0 008.625 8.25m8.25 0H7.875"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mt-4">ChatPro</h1>
        <p className="text-gray-500 text-center">Crie sua conta para começar</p>
      </div>

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center">Registrar</h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Preencha os dados para criar sua conta
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome completo</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A6.978 6.978 0 0012 21a6.978 6.978 0 006.879-3.196M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full py-2 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12H8m8 0a4 4 0 00-8 0m8 0a4 4 0 01-8 0M5.121 17.804A6.978 6.978 0 0012 21a6.978 6.978 0 006.879-3.196"
                />
              </svg>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full py-2 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-5a2 2 0 00-2-2h-2v-2a4 4 0 00-8 0v2H6a2 2 0 00-2 2v5a2 2 0 002 2z"
                />
              </svg>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full py-2 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Registrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Já tem uma conta?{' '}
          <button type="button" className="text-blue-600 hover:underline bg-transparent border-none p-0 m-0" onClick={() => navigate('/login')}>
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
