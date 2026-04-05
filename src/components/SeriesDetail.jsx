import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [tmdb, setTmdb] = useState(null);
  const [temporadaData, setTemporadaData] = useState(null);
  const [temporadaSel, setTemporadaSel] = useState("4");
  const [isMovie, setIsMovie] = useState(false);

  const API_KEY = "844dba0bfd8f3a4f3799f6130ef9e335";

  useEffect(() => {
    // Buscamos en la librería comparando IDs (como string para evitar fallos)
    const found = mySeries.find(s => String(s.id) === String(id) || String(s.tmdbId) === String(id));
    setSerie(found || null);

    // Si no está en la librería o es tipo 'movie', lo tratamos como película
    const isActuallyMovie = !found || found.type === "movie";
    setIsMovie(isActuallyMovie);

    const typePath = isActuallyMovie ? 'movie' : 'tv';
    
    fetch(`https://api.themoviedb.org/3/${typePath}/${id}?api_key=${API_KEY}&language=es-ES`)
      .then(res => res.json())
      .then(data => {
        setTmdb(data);
        // Si es serie y tiene temporada default en la librería, la usamos
        if (found?.temporadaDefault) setTemporadaSel(found.temporadaDefault);
      });
  }, [id]);

  useEffect(() => {
    if (serie && !isMovie) {
      fetch(`https://api.themoviedb.org/3/tv/${serie.tmdbId}/season/${temporadaSel}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(setTemporadaData);
    }
  }, [serie, temporadaSel, isMovie]);

  if (!tmdb) return <div style={{padding: '100px', textAlign: 'center', color: 'white'}}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white', overflowX: 'hidden' }}>
      {/* Hero Header */}
      <div className="hero-container" style={{ 
        height: '65vh', position: 'relative',
        backgroundImage: `linear-gradient(to top, #0f171e 15%, transparent 85%), linear-gradient(to right, #0f171e 20%, transparent 100%), url(https://image.tmdb.org/t/p/original${tmdb.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%'
      }}>
        <div className="hero-content" style={{ padding: '0 5%', position: 'absolute', bottom: '30px', width: '100%', boxSizing: 'border-box' }}>
          <h1 className="main-title" style={{ fontWeight: 900, marginBottom: '10px' }}>{tmdb.name || tmdb.title}</h1>
          <div className="metadata" style={{ display: 'flex', gap: '12px', marginBottom: '15px', fontSize: '0.85rem', color: '#8197a4' }}>
             <span>{tmdb.vote_average?.toFixed(1)} ★</span>
             <span>{(tmdb.first_air_date || tmdb.release_date)?.split('-')[0]}</span>
             <span>{isMovie ? `${tmdb.runtime} min` : `${tmdb.number_of_seasons} Temporadas`}</span>
          </div>
          <p className="description" style={{ lineHeight: '1.4', color: '#ccc', marginBottom: '25px', maxWidth: '700px' }}>{tmdb.overview}</p>
          
          {isMovie ? (
            serie?.url ? (
              <a href={serie.url} target="_blank" rel="noreferrer" style={{ background: '#00a8e1', color: 'white', padding: '12px 25px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Reproducir Película</a>
            ) : (
              <button disabled style={{ background: '#333', color: '#777', padding: '12px 25px', borderRadius: '4px', border: 'none', cursor: 'not-allowed' }}>Próximamente</button>
            )
          ) : (
            <div className="season-selector" style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {serie?.temporadasDisponibles?.map(t => (
                <button key={t} onClick={() => setTemporadaSel(t.toString())} style={{ background: temporadaSel === t.toString() ? '#00a8e1' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>Temporada {t}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isMovie && (
        <div style={{ padding: '30px 5%' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Episodios</h2>
          <div className="episodes-grid">
            {temporadaData?.episodes?.map((ep, index) => {
              const localCap = serie?.capitulos[temporadaSel]?.[index];
              return (
                <a key={ep.id} href={localCap?.url || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="ep-card" style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#1a242f' }}>
                    <img src={`https://image.tmdb.org/t/p/w500${ep.still_path || tmdb.backdrop_path}`} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} alt="" />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{ep.episode_number}. {ep.name}</h3>
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
        @media (max-width: 1024px) { .episodes-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .episodes-grid { grid-template-columns: 1fr; } .main-title { font-size: 1.6rem; } }
      `}</style>
    </div>
  );
};

export default SeriesDetail;
