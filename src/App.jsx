import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Catalog from './components/Catalog';
import SeriesDetail from './components/SeriesDetail';

function App() {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: '#0f171e', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ padding: '15px 4%', display: 'flex', alignItems: 'center', gap: '12px', background: '#0f171e', borderBottom: '1px solid #252e39', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: '1.6rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
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
