import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Catalog from './components/Catalog';
import SeriesDetail from './components/SeriesDetail';

function App() {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: '#0f171e', minHeight: '100vh', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <nav style={{ 
        padding: '15px 4%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15, 23, 30, 0.8)', backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 1000 
      }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px' }}>
            PRIME <span style={{ 
              color: '#00a8e1', 
              textShadow: '0 0 20px rgba(0, 168, 225, 0.5)',
              background: 'linear-gradient(45deg, #00a8e1, #00ffcc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>G</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', fontWeight: 600, color: '#8197a4' }}>
          <span style={{ color: 'white' }}>Inicio</span>
          <span>Series</span>
          <span>Películas</span>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
      </Routes>
    </div>
  );
}
export default App;
