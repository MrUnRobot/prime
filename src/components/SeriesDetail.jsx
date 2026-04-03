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
      // Cargar info general de la serie
      fetch(`https://api.themoviedb.org/3/tv/${found.tmdbId}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(data => setTmdb(data));
    }
  }, [id]);

  useEffect(() => {
    if (serie) {
      // Cargar info específica de la temporada (para fotos de episodios)
      fetch(`https://api.themoviedb.org/3/tv/${serie.tmdbId}/season/${temporadaSel}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(data => setTemporadaData(data));
    }
  }, [serie, temporadaSel]);

  if (!serie || !tmdb) return <div style={{padding: '100px', textAlign: 'center'}}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', overflowX: 'hidden' }}>
      {/* Hero Header */}
      <div style={{ 
        height: '60vh', position: 'relative',
        backgroundImage: `linear-gradient(to top, #0f171e 5%, transparent 60%), linear-gradient(to right, #0f171e 20%, transparent 100%), url(https://image.tmdb.org/t/p/original${tmdb.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%'
      }}>
        <div style={{ padding: '0 4%', position: 'absolute', bottom: '30px', maxWidth: '900px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '10px' }}>{tmdb.name}</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px', color: '#8197a4', fontSize: '0.9rem' }}>
            <span style={{ color: '#46d369', fontWeight: 'bold' }}>{tmdb.vote_average?.toFixed(1)} Rating</span>
            <span>{tmdb.first_air_date?.split('-')[0]}</span>
            <span style={{ border: '1px solid #8197a4', padding: '0 6px', borderRadius: '4px' }}>18+</span>
            <span>{tmdb.number_of_seasons} Temporadas</span>
            <span style={{ color: '#00a8e1' }}>AD, CC</span>
          </div>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.5', color: '#ccc', marginBottom: '25px' }}>{tmdb.overview}</p>
          
          <select 
            value={temporadaSel} 
            onChange={(e) => setTemporadaSel(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
          >
            {serie.temporadasDisponibles.map(t => <option key={t} value={t} style={{background: '#0f171e'}}>Temporada {t}</option>)}
          </select>
        </div>
      </div>

      {/* Lista Horizontal de Episodios */}
      <div style={{ padding: '40px 0 60px 4%' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 700 }}>Episodios</h2>
        
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '20px', 
          paddingRight: '4%',
          scrollbarWidth: 'none', // Oculta scroll en Firefox
          msOverflowStyle: 'none' // Oculta scroll en IE
        }}>
          {temporadaData?.episodes?.map((ep, index) => {
            // Buscamos el link de Google Photos en nuestro archivo local
            const localCap = serie.capitulos[temporadaSel]?.[index];
            const videoUrl = localCap ? localCap.url : "#";

            return (
              <a 
                key={ep.id} 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit', flex: '0 0 350px' }}
              >
                <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', transition: 'transform 0.3s' }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${ep.still_path || tmdb.backdrop_path}`} 
                    alt={ep.name} 
                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                  <div style={{ 
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' 
                  }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,168,225,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{ep.episode_number}. {ep.name}</span>
                    <span style={{ color: '#8197a4', fontSize: '0.8rem' }}>{ep.runtime} min</span>
                  </div>
                  <p style={{ 
                    fontSize: '0.85rem', color: '#8197a4', lineHeight: '1.4', 
                    display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                  }}>
                    {ep.overview || "Sin descripción disponible para este episodio."}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#555' }}>Lanzamiento: {ep.air_date}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
