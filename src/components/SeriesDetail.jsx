import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serie, setSerie] = useState(null);
  const [tmdb, setTmdb] = useState(null);
  const [temporadaData, setTemporadaData] = useState(null);
  const [temporadaSel, setTemporadaSel] = useState("4");

  const API_KEY = "844dba0bfd8f3a4f3799f6130ef9e335";

  useEffect(() => {
    const found = mySeries.find(s => String(s.id) === String(id));
    if (found) {
      setSerie(found);
      fetch(`https://api.themoviedb.org/3/tv/${found.tmdbId}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(data => setTmdb(data));
    }
  }, [id]);

  useEffect(() => {
    if (serie) {
      fetch(`https://api.themoviedb.org/3/tv/${serie.tmdbId}/season/${temporadaSel}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(data => setTemporadaData(data));
    }
  }, [serie, temporadaSel]);

  if (!serie || !tmdb) return <div style={{padding: '100px', textAlign: 'center', color: 'white'}}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Header */}
      <div style={{ 
        height: '55vh', position: 'relative',
        backgroundImage: `linear-gradient(to top, #0f171e 10%, transparent 80%), linear-gradient(to right, #0f171e 25%, transparent 100%), url(https://image.tmdb.org/t/p/original${tmdb.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%'
      }}>
        <div style={{ padding: '0 4%', position: 'absolute', bottom: '40px', maxWidth: '850px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '10px' }}>{tmdb.name}</h1>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', fontSize: '0.9rem', color: '#8197a4' }}>
             <span style={{ color: '#46d369', fontWeight: 'bold' }}>{tmdb.vote_average?.toFixed(1)} ★</span>
             <span>{tmdb.first_air_date?.split('-')[0]}</span>
             <span style={{ border: '1px solid #8197a4', padding: '0 8px', borderRadius: '4px' }}>18+</span>
             <span>HD</span>
          </div>

          <p style={{ fontSize: '1.1rem', lineHeight: '1.5', color: '#ccc', marginBottom: '30px' }}>{tmdb.overview}</p>
          
          {/* Selector de Temporada - Estilo Pastilla */}
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
            {serie.temporadasDisponibles.map(t => (
              <button 
                key={t}
                onClick={() => setTemporadaSel(t.toString())}
                style={{
                  background: temporadaSel === t.toString() ? '#00a8e1' : 'rgba(255,255,255,0.08)',
                  color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px',
                  cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: '0.3s'
                }}
              >
                Temporada {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Episodios (4 por fila) */}
      <div style={{ padding: '50px 4%' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '30px', fontWeight: 700 }}>Episodios</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(calc(25% - 20px), 1fr))', 
          gap: '30px 20px' 
        }}>
          {temporadaData?.episodes?.map((ep, index) => {
            const localCap = serie.capitulos[temporadaSel]?.[index];
            return (
              <a 
                key={ep.id} 
                href={localCap?.url || '#'} 
                target="_blank" 
                rel="noreferrer" 
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div className="ep-card" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1a242f' }}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${ep.still_path || tmdb.backdrop_path}`} 
                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} 
                    alt={ep.name} 
                  />
                  <div className="play-overlay" style={{ 
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' 
                  }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#00a8e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>▶</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, maxWidth: '80%' }}>{ep.episode_number}. {ep.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#8197a4' }}>{ep.runtime} min</span>
                  </div>
                  <p style={{ 
                    fontSize: '0.85rem', color: '#8197a4', lineHeight: '1.4', margin: 0,
                    display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {ep.overview || "No hay descripción disponible."}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        .ep-card:hover .play-overlay { opacity: 1 !important; }
        .ep-card:hover { transform: translateY(-5px); transition: 0.3s; }
        /* Scrollbar suave para la página */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f171e; }
        ::-webkit-scrollbar-thumb { background: #333; borderRadius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
};

export default SeriesDetail;
