import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serie, setSerie] = useState(null);
  const [tmdb, setTmdb] = useState(null);

  useEffect(() => {
    // Buscamos por el ID que ahora es 95557
    const found = mySeries.find(s => String(s.id) === String(id));
    if (found) {
      setSerie(found);
      fetch(`https://api.themoviedb.org/3/tv/${found.tmdbId}?api_key=844dba0bfd8f3a4f3799f6130ef9e335&language=es-ES`)
        .then(res => res.json())
        .then(data => setTmdb(data));
    }
  }, [id]);

  if (!serie) return <div style={{padding: '50px', textAlign: 'center'}}><h2>Serie no encontrada (ID: {id})</h2><button onClick={() => navigate('/')}>Volver</button></div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white', padding: '40px 4%' }}>
      <button onClick={() => navigate('/')} style={{ background: 'none', color: '#00a8e1', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>← Volver</button>
      <h1 style={{ fontSize: '2.5rem' }}>{tmdb?.name || "Cargando..."}</h1>
      <p style={{ color: '#00a8e1' }}>Temporada {serie.temporada}</p>
      <p style={{ maxWidth: '800px', color: '#8197a4', marginBottom: '30px' }}>{tmdb?.overview}</p>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {serie.capitulos.map((cap, index) => (
          <div key={index} style={{ background: '#1a242f', padding: '20px', borderRadius: '8px', border: '1px solid #252e39' }}>
            <h3>{index + 1}. {cap.titulo}</h3>
            <video controls width="100%" style={{ marginTop: '10px', borderRadius: '4px' }}>
              <source src={cap.videoUrl} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesDetail;
