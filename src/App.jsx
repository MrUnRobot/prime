import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { mySeries } from './data/myLibrary.js';
import PrimeRow from './components/PrimeRow';
import SeriesDetail from './components/SeriesDetail';
import { motion } from 'framer-motion';

const Catalog = () => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{ padding: '0 4%' }}
  >
    <h1 style={{ fontSize: '1.8rem', marginBottom: '30px', fontWeight: '300' }}>Series para ti</h1>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {mySeries.map((series) => (
        <PrimeRow key={series.id} series={series} />
      ))}
    </div>
  </motion.div>
);

function App() {
  return (
    <Router>
      <div style={{ 
        backgroundColor: '#0f171e', minHeight: '100vh', color: 'white', 
        fontFamily: 'Arial, sans-serif', overflowX: 'hidden' 
      }}>
        <nav style={{ 
          height: '70px', background: '#0f171e', display: 'flex', alignItems: 'center', 
          padding: '0 4%', position: 'fixed', width: '100%', zIndex: 100, top: 0,
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Link to="/">
            <img 
              src="https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.svg" 
              alt="Prime" style={{ height: '30px' }} 
            />
          </Link>
          <div style={{ marginLeft: '40px', display: 'flex', gap: '20px', fontSize: '0.9rem', color: '#8197a4' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Inicio</Link>
            <span>Series</span>
            <span>Películas</span>
          </div>
        </nav>

        <main style={{ paddingTop: '110px' }}>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/serie/:id" element={<SeriesDetail />} />
          </Routes>
        </main>

        <style>{`
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #0f171e; }
          ::-webkit-scrollbar-thumb { background: #1a242f; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #00a8e1; }
          * { scrollbar-color: #1a242f #0f171e; scrollbar-width: thin; }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
