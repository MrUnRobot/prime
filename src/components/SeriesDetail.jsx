import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serie, setSerie] = useState(null);
  const [tmdb, setTmdb] = useState(null);

  useEffect(() => {
    const found = mySeries.find(s => String(s.id) === String(id));
    if (found) {
      setSerie(found);
      fetch(`https://api.themoviedb.org/3/tv/${found.tmdbId}?api_key=844dba0bfd8f3a4f3799f6130ef9e335&language=es-ES`)
        .then(res => res.json())
        .then(data => setTmdb(data));
    }
  }, [id]);

  if (!serie) return <div style={{padding: '50px', textAlign: 'center'}}><h2>Serie no encontrada</h2><button onClick={() => navigate('/')}>Volver</button></div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white', padding: '40px 4%' }}>
      <button onClick={() => navigate('/')} style={{ background: 'none', color: '#00a8e1', border: 'none', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}>
        ← Volver al catálogo
      </button>

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>{tmdb?.name || "Invencible"}</h1>
        <p style={{ color: '#00a8e1', fontWeight: 'bold', fontSize: '1.2rem' }}>Temporada {serie.temporada}</p>
        <p style={{ maxWidth: '800px', color: '#8197a4', lineHeight: '1.6', fontSize: '1.1rem' }}>{tmdb?.overview}</p>
      </div>
      
      <h2 style={{ borderBottom: '1px solid #252e39', paddingBottom: '10px', marginBottom: '20px' }}>Episodios</h2>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {serie.capitulos.map((cap, index) => (
          <div key={index} style={{ 
            background: '#1a242f', 
            padding: '20px', 
            borderRadius: '8px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            border: '1px solid #252e39' 
          }}>
            <div>
              <h3 style={{ margin: 0 }}>{index + 1}. {cap.titulo}</h3>
              <span style={{ color: '#8197a4', fontSize: '0.9rem' }}>Google Photos Video</span>
            </div>
            <a 
              href={cap.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                backgroundColor: '#00a8e1', 
                color: 'white', 
                padding: '10px 25px', 
                borderRadius: '4px', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              REPRODUCIR
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesDetail;
