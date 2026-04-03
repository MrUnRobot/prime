import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!serie || !tmdb) return <div style={{padding: '100px', textAlign: 'center', color: 'white'}}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white' }}>
      {/* Hero Section */}
      <div style={{ 
        height: '60vh', position: 'relative',
        backgroundImage: `linear-gradient(to top, #0f171e 5%, transparent 60%), linear-gradient(to right, #0f171e 20%, transparent 100%), url(https://image.tmdb.org/t/p/original${tmdb.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%'
      }}>
        <div style={{ padding: '0 4%', position: 'absolute', bottom: '30px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900 }}>{tmdb.name}</h1>
          <p style={{ maxWidth: '800px', color: '#ccc', marginBottom: '20px' }}>{tmdb.overview}</p>
          
          {/* Selector de Temporadas Estilizado */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            {serie.temporadasDisponibles.map(t => (
              <button 
                key={t}
                onClick={() => setTemporadaSel(t.toString())}
                style={{
                  background: temporadaSel === t.toString() ? '#00a8e1' : 'rgba(255,255,255,0.1)',
                  color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px',
                  cursor: 'pointer', fontWeight: 'bold', transition: '0.3s', whiteSpace: 'nowrap'
                }}
              >
                Temporada {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fila de Episodios con Navegación 4x4 */}
      <div style={{ padding: '40px 4%', position: 'relative' }}>
        <h2 style={{ marginBottom: '20px' }}>Episodios</h2>
        
        {/* Botones de Navegación */}
        <button onClick={() => scroll('left')} style={btnStyle}>‹</button>
        <button onClick={() => scroll('right')} style={{...btnStyle, right: '10px'}}>›</button>

        <div ref={scrollRef} style={{ 
          display: 'flex', gap: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: '20px'
        }}>
          {temporadaData?.episodes?.map((ep, index) => {
            const localCap = serie.capitulos[temporadaSel]?.[index];
            return (
              <a key={ep.id} href={localCap?.url || '#'} target="_blank" rel="noreferrer" style={{
                flex: '0 0 calc(25% - 15px)', minWidth: '300px', textDecoration: 'none', color: 'inherit',
                scrollSnapAlign: 'start'
              }}>
                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={`https://image.tmdb.org/t/p/w500${ep.still_path || tmdb.backdrop_path}`} 
                       style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} alt="" />
                  <div className="hover-play" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', opacity: 0, transition: '0.3s' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#00a8e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</div>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '5px' }}>{ep.episode_number}. {ep.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#8197a4', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ep.overview}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <style>{`
        .hover-play:hover { opacity: 1 !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const btnStyle = {
  position: 'absolute', top: '55%', transform: 'translateY(-50%)', left: '10px',
  zIndex: 10, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
  width: '40px', height: '80px', fontSize: '2rem', cursor: 'pointer', borderRadius: '4px'
};

export default SeriesDetail;
