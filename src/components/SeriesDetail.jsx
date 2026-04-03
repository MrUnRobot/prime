import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serie, setSerie] = useState(null);
  const [tmdbData, setTmdbData] = useState(null);

  useEffect(() => {
    // Buscamos asegurando que ambos sean tratados como números
    const found = mySeries.find(s => Number(s.id) === Number(id));
    setSerie(found);

    if (found) {
      fetch(`https://api.themoviedb.org/3/tv/${found.tmdbId}?api_key=844dba0bfd8f3a4f3799f6130ef9e335&language=es-ES`)
        .then(res => res.json())
        .then(data => setTmdbData(data))
        .catch(err => console.error("Error cargando TMDB:", err));
    }
  }, [id]);

  if (!serie) return <div style={{padding: '50px', textAlign: 'center'}}><h2>Serie no encontrada</h2><button onClick={() => navigate('/')}>Volver</button></div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white' }}>
      {/* Cabecera con Sinopsis */}
      <div style={{ padding: '40px 4%', background: 'linear-gradient(to bottom, #1a242f, #0f171e)' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', color: '#00a8e1', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>← Volver al catálogo</button>
        <h1 style={{ fontSize: '3rem', margin: '0' }}>{tmdbData?.name || "Cargando..."}</h1>
        <p style={{ color: '#00a8e1', fontWeight: 'bold' }}>Temporada {serie.temporada}</p>
        <p style={{ maxWidth: '800px', lineHeight: '1.6', fontSize: '1.1rem', color: '#8197a4' }}>
          {tmdbData?.overview || "Sin sinopsis disponible."}
        </p>
      </div>

      {/* Lista de Capítulos */}
      <div style={{ padding: '0 4% 40px' }}>
        <h2 style={{ borderBottom: '1px solid #252e39', paddingBottom: '10px' }}>Episodios</h2>
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          {serie.capitulos.map((cap, index) => (
            <div key={index} style={{ background: '#1a242f', borderRadius: '8px', padding: '20px', border: '1px solid #252e39' }}>
              <h3 style={{ marginTop: 0 }}>{index + 1}. {cap.titulo}</h3>
              <video controls width="100%" style={{ borderRadius: '4px', maxWidth: '800px' }}>
                <source src={cap.videoUrl} type="video/mp4" />
                Tu navegador no soporta video.
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
