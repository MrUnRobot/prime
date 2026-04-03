import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serie, setSerie] = useState(null);
  const [tmdb, setTmdb] = useState(null);
  const [temporadaSel, setTemporadaSel] = useState("4");

  useEffect(() => {
    const found = mySeries.find(s => String(s.id) === String(id));
    if (found) {
      setSerie(found);
      fetch(`https://api.themoviedb.org/3/tv/${found.tmdbId}?api_key=844dba0bfd8f3a4f3799f6130ef9e335&language=es-ES`)
        .then(res => res.json())
        .then(data => setTmdb(data));
    }
  }, [id]);

  if (!serie || !tmdb) return <div style={{padding: '50px', textAlign: 'center', color: 'white'}}>Cargando...</div>;

  const episodios = serie.capitulos[temporadaSel] || [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white' }}>
      {/* Hero Section con Backdrop */}
      <div style={{ 
        height: '60vh', position: 'relative', 
        backgroundImage: `linear-gradient(to right, #0f171e 20%, transparent 100%), url(https://image.tmdb.org/t/p/original${tmdb.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center center'
      }}>
        <div style={{ padding: '60px 4%', position: 'absolute', bottom: '20px', maxWidth: '800px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', color: '#00a8e1', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>← Volver</button>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>{tmdb.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ color: '#00a8e1', fontWeight: 'bold' }}>Rating: {tmdb.vote_average?.toFixed(1)} ★</span>
            <span style={{ border: '1px solid #8197a4', padding: '0 8px', borderRadius: '4px', color: '#8197a4' }}>18+</span>
            <span>{tmdb.first_air_date?.split('-')[0]}</span>
          </div>

          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#ccc', marginBottom: '30px' }}>{tmdb.overview}</p>
          
          {/* Selector de Temporada Estilizado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: 'bold' }}>Temporada:</span>
            <select 
              value={temporadaSel} 
              onChange={(e) => setTemporadaSel(e.target.value)}
              style={{ background: '#1a242f', color: 'white', border: '1px solid #333', padding: '8px 15px', borderRadius: '4px' }}
            >
              {serie.temporadasDisponibles.map(t => <option key={t} value={t}>Temporada {t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Episodios con Miniaturas */}
      <div style={{ padding: '40px 4%' }}>
        <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Episodios</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {episodios.map((cap, index) => (
            <div key={index} style={{ 
              display: 'flex', gap: '20px', background: '#1b2530', padding: '15px', 
              borderRadius: '8px', border: '1px solid #252e39', alignItems: 'center' 
            }}>
              <div style={{ position: 'relative', width: '220px', flexShrink: 0 }}>
                <img 
                  src={`https://image.tmdb.org/t/p/w300${tmdb.backdrop_path}`} 
                  alt={cap.titulo} 
                  style={{ width: '100%', borderRadius: '4px', opacity: '0.7' }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '2rem' }}>▶</div>
              </div>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{index + 1}. {cap.titulo}</h3>
                <p style={{ margin: '0 0 15px 0', color: '#8197a4', fontSize: '0.95rem' }}>{cap.sinopsis}</p>
                <a 
                  href={cap.url} target="_blank" rel="noopener noreferrer"
                  style={{ backgroundColor: '#00a8e1', color: 'white', padding: '8px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-block' }}
                >
                  REPRODUCIR
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
