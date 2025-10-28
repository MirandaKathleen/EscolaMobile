import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import Home from '@/home/Home'
import Atividades from '@/atividades/Atividades'

function App() {
  return (
    <div style={{ backgroundColor: '#89CFF0', minHeight: '100vh' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/atividades" element={<Atividades />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
