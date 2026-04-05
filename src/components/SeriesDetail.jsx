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
  const [isMovie, setIsMovie] = useState(false);

  const API_KEY = "844dba0bfd8f3a4f3799f6130ef9e335";

  useEffect(() => {
    const found = mySeries.find(s => String(s.id) === String(id));
    const isAvatar = id === "19995" || id === "76600";
    
    if (found && !isAvatar) {
      setSerie(found);
      setIsMovie(false);
      fetch(`https://api.themoviedb.org/3/tv/${found.tmdbId}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(data => setTmdb(data));
    } else {
      setIsMovie(true);
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(data => setTmdb(data));
    }
  }, [id]);

  useEffect(() => {
    if (serie && !isMovie) {
      fetch(`https://api.themoviedb.org/3/tv/${serie.tmdbId}/season/${temporadaSel}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(data => setTemporadaData(data));
    }
  }, [serie, temporadaSel, isMovie]);

  if (!tmdb) return <div style={{padding: '100px', textAlign: 'center', color: 'white'}}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white', overflowX: 'hidden' }}>
      {/* Hero Header */}
      <div className="hero-container" style={{ 
        height: '70vh', position: 'relative',
        backgroundImage: `linear-gradient(to top, #0f171e 15%, transparent 85%), linear-gradient(to right, #0f171e 20%, transparent 100%), url(https://image.tmdb.org/t/p/original${tmdb.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%',
        width: '100%'
      }}>
        <div className="hero-content" style={{ 
          padding: '0 5%', 
          position: 'absolute', 
          bottom: '30px', 
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h1 className="main-title" style={{ fontWeight: 900, marginBottom: '10px', lineHeight: '1.1' }}>
            {tmdb.name || tmdb.title}
          </h1>
          
          <div className="metadata" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '15px', fontSize: '0.85rem', color: '#8197a4', flexWrap: 'wrap' }}>
             <span style={{ color: '#46d369', fontWeight: 'bold' }}>{tmdb.vote_average?.toFixed(1)} ★</span>
             <span>{(tmdb.first_air_date || tmdb.release_date)?.split('-')[0]}</span>
             <span style={{ border: '1px solid #8197a4', padding: '0 6px', borderRadius: '4px' }}>18+</span>
             <span>{isMovie ? `${tmdb.runtime} min` : `${tmdb.number_of_seasons} Temporadas`}</span>
          </div>

          <p className="description" style={{ lineHeight: '1.4', color: '#ccc', marginBottom: '25px', maxWidth: '700px' }}>
            {tmdb.overview}
          </p>
          
          {isMovie ? (
            <a href="https://photos.google.com/search/ChdBZ3JlZ2Fkb3MgcmVjaWVudGVtZW50ZSIIEgYKBHICCgAo3pTP19Uz/photo/AF1QipOz_RHrWy_TmsHwQfqFgTA7__1GlTmpJWRYHhFL" target="_blank" rel="noreferrer" style={{
              background: '#00a8e1', color: 'white', padding: '12px 25px', borderRadius: '4px', 
              textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', display: 'inline-block'
            }}>Reproducir Película</a>
          ) : (
            <div className="season-selector" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', width: '100%' }}>
              {serie?.temporadasDisponibles.map(t => (
                <button key={t} onClick={() => setTemporadaSel(t.toString())} style={{
                  background: temporadaSel === t.toString() ? '#00a8e1' : 'rgba(255,255,255,0.1)',
                  color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '0.85rem'
                }}>Temporada {t}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isMovie && (
        <div style={{ padding: '30px 5%' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', fontWeight: 700 }}>Episodios</h2>
          <div className="episodes-grid">
            {temporadaData?.episodes?.map((ep, index) => {
              const localCap = serie.capitulos[temporadaSel]?.[index];
              return (
                <a key={ep.id} href={localCap?.url || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="ep-card" style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#1a242f' }}>
                    <img src={`https://image.tmdb.org/t/p/w500${ep.still_path || tmdb.backdrop_path}`} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                    <div className="play-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#00a8e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{ep.episode_number}. {ep.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#8197a4' }}>{ep.runtime} min</span>
                    </div>
                    <p className="ep-overview" style={{ fontSize: '0.8rem', color: '#8197a4', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: '4px' }}>{ep.overview}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .episodes-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .main-title { font-size: 3rem; }
        .description { font-size: 1rem; }

        @media (max-width: 1024px) { 
          .episodes-grid { grid-template-columns: repeat(2, 1fr); } 
          .main-title { font-size: 2.2rem; }
        }

        @media (max-width: 600px) { 
          .episodes-grid { grid-template-columns: 1fr; } 
          .main-title { font-size: 1.6rem; } 
          .description { font-size: 0.85rem; -webkit-line-clamp: 4; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
          .hero-container { height: 60vh; background-position: center center; }
          .hero-content { padding: 0 15px !important; bottom: 15px !important; }
          .metadata { gap: 8px !important; }
        }
        .ep-card:hover .play-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default SeriesDetail;
