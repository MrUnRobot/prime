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
        .then(data => setTemporadaData(data))
        .catch(err => console.error("Error cargando temporada:", err));
    }
  }, [serie, temporadaSel]);

  if (!serie || !tmdb) return <div style={{padding: '100px', textAlign: 'center', color: 'white'}}>Cargando experiencia Prime...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white', overflowX: 'hidden' }}>
      {/* Hero Header mejorado */}
      <div style={{ 
        height: '65vh', position: 'relative',
        backgroundImage: `linear-gradient(to top, #0f171e 10%, transparent 70%), linear-gradient(to right, #0f171e 15%, transparent 100%), url(https://image.tmdb.org/t/p/original${tmdb.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%'
      }}>
        <div style={{ padding: '0 4%', position: 'absolute', bottom: '40px', maxWidth: '900px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', color: '#00a8e1', border: 'none', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>← INICIO</button>
          <h1 style={{ fontSize: '3.8rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-1px' }}>{tmdb.name}</h1>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', fontSize: '0.95rem', fontWeight: 600 }}>
            <span style={{ color: '#46d369' }}>{tmdb.vote_average?.toFixed(1)} ★</span>
            <span style={{ color: '#ccc' }}>{tmdb.first_air_date?.split('-')[0]}</span>
            <span style={{ border: '1px solid #8197a4', padding: '1px 8px', borderRadius: '4px', color: '#8197a4', fontSize: '0.8rem' }}>18+</span>
            <span style={{ color: '#8197a4' }}>{tmdb.number_of_seasons} Temporadas</span>
          </div>
          
          <p style={{ fontSize: '1.15rem', lineHeight: '1.6', color: '#e5e5e5', marginBottom: '30px', maxWidth: '800px' }}>{tmdb.overview}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <span style={{ fontWeight: 'bold', color: '#8197a4' }}>Temporada</span>
             <select 
                value={temporadaSel} 
                onChange={(e) => setTemporadaSel(e.target.value)}
                style={{ background: '#1a242f', color: 'white', border: '1px solid #333', padding: '10px 25px', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}
              >
                {serie.temporadasDisponibles.map(t => <option key={t} value={t} style={{background: '#0f171e'}}>Temporada {t}</option>)}
              </select>
          </div>
        </div>
      </div>

      {/* Carrusel de Episodios Estilo Prime */}
      <div style={{ padding: '40px 0 80px 4%' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '25px' }}>Episodios</h2>
        
        <div className="episode-scroll" style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '25px', 
          paddingRight: '4%',
          paddingBottom: '20px'
        }}>
          {temporadaData?.episodes?.map((ep, index) => {
            const localCap = serie.capitulos[temporadaSel]?.[index];
            const videoUrl = localCap ? localCap.url : "#";

            return (
              <a 
                key={ep.id} 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit', flex: '0 0 380px' }}
              >
                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1a242f' }}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${ep.still_path || tmdb.backdrop_path}`} 
                    alt={ep.name} 
                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} 
                  />
                  {/* Overlay de Hover (Igual que Prime) */}
                  <div style={{ 
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' 
                  }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#00a8e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 0 20px rgba(0,168,225,0.6)' }}>▶</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '15px', padding: '0 5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{ep.episode_number}. {ep.name}</h3>
                    <span style={{ color: '#8197a4', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{ep.runtime || '--'} min</span>
                  </div>
                  <p style={{ 
                    fontSize: '0.9rem', color: '#8197a4', lineHeight: '1.5', margin: '0 0 10px 0',
                    display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '4.5em'
                  }}>
                    {ep.overview || "No hay descripción disponible para este episodio en este momento."}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#444', fontWeight: 'bold' }}>
                    ESTRENO: {ep.air_date}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        .episode-scroll::-webkit-scrollbar { display: none; }
        .episode-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SeriesDetail;
