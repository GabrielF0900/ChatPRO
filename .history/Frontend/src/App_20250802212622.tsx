import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';
import LoginPage from './pages/Login';
import ChatPage from './pages/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
