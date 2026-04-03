import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Catalog from './components/Catalog';
import SeriesDetail from './components/SeriesDetail';
import logo from './assets/logo.svg';

function App() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#0f171e', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar con el nuevo nombre y logo corregido */}
      <nav style={{ 
        padding: '15px 4%', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        background: 'linear-gradient(to bottom, rgba(15,23,30,1) 0%, rgba(15,23,30,0) 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <img 
          src={logo} 
          alt="Prime G Logo" 
          style={{ height: '35px', cursor: 'pointer' }} 
          onClick={() => navigate('/')} 
        />
        <h1 
          style={{ 
            color: '#fff', 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            letterSpacing: '1px'
          }} 
          onClick={() => navigate('/')}
        >
          Prime <span style={{ color: '#00a8e1' }}>G</span>
        </h1>
      </nav>

      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
      </Routes>
    </div>
  );
}

export default App;
