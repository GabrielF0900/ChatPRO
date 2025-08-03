import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Register from './pages/Register';

function App() {

  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
