import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';
import { motion } from 'framer-motion';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  
  const seriesInfo = mySeries.find(s => s.id === parseInt(id));
  const API_KEY = "844dba0bfd8f3a4f3799f6130ef9e335";

  useEffect(() => {
    if (seriesInfo) {
      fetch(`https://api.themoviedb.org/3/tv/${seriesInfo.tmdbId}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json()).then(json => setData(json));

      fetch(`https://api.themoviedb.org/3/tv/${seriesInfo.tmdbId}/season/${seriesInfo.temporada}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.ok ? res.json() : { episodes: [] })
        .then(json => setEpisodes(json.episodes || []))
        .catch(() => setEpisodes([]));
    }
  }, [seriesInfo]);

  if (!data) return <div style={{padding: '100px', textAlign: 'center', color: '#00a8e1'}}>Cargando...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px 4% 100px 4%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start' // Alinea el contenedor al inicio (izquierda)
      }}
    >
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'none', border: 'none', color: '#00a8e1', cursor: 'pointer', marginBottom: '30px', fontSize: '1rem', padding: 0 }}
      >
        ‹ Volver al inicio
      </button>

      {/* Sección de Cabecera */}
      <div style={{ 
        display: 'flex', 
        gap: '40px', 
        flexWrap: 'wrap', 
        width: '100%',
        marginBottom: '50px',
        justifyContent: 'flex-start'
      }}>
        <img 
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} 
          style={{ width: '280px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', height: 'fit-content' }} 
          alt="Poster" 
        />
        
        <div style={{ flex: '1', minWidth: '300px', textAlign: 'left' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', margin: '0 0 10px 0', lineHeight: '1.1' }}>
            {data.name}
          </h1>
          <div style={{ display: 'flex', gap: '15px', color: '#00a8e1', fontWeight: 'bold', marginBottom: '20px', fontSize: '1.1rem' }}>
            <span>Temporada {seriesInfo.temporada}</span>
            <span style={{ color: '#8197a4' }}>{data.first_air_date.split('-')[0]}</span>
          </div>
          <p style={{ 
            lineHeight: '1.7', 
            color: '#ccc', 
            fontSize: '1.1rem', 
            maxWidth: '700px', // Limita el ancho para que no se "distorsione" al estirarse
            marginBottom: '30px'
          }}>
            {data.overview}
          </p>
        </div>
      </div>

      {/* Sección de Episodios */}
      <div style={{ width: '100%' }}>
        <h3 style={{ 
          fontSize: '1.8rem', 
          marginBottom: '30px', 
          paddingBottom: '10px', 
          borderBottom: '1px solid #333',
          textAlign: 'left'
        }}>
          Episodios
        </h3>
        
        <div style={{ display: 'grid', gap: '15px', width: '100%' }}>
          {seriesInfo.capitulos.map((cap, i) => {
            const apiEp = episodes[i];
            return (
              <motion.a 
                key={i} 
                href={cap.videoUrl} 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ backgroundColor: '#1f2937', x: 5 }}
                style={{
                  display: 'flex', 
                  gap: '20px', 
                  padding: '15px', 
                  backgroundColor: '#1a242f',
                  borderRadius: '10px', 
                  textDecoration: 'none', 
                  color: 'white', 
                  alignItems: 'center',
                  border: '1px solid transparent',
                  transition: 'border 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#00a8e1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div style={{ width: '180px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden' }}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w300${apiEp?.still_path || data.backdrop_path}`} 
                    style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>
                    {i + 1}. {apiEp?.name || cap.titulo || `Episodio ${i+1}`}
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.9rem', 
                    color: '#8197a4', 
                    display: '-webkit-box', 
                    WebkitLineClamp: '2', 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    lineHeight: '1.4'
                  }}>
                    {apiEp?.overview || "Haz clic para reproducir este episodio."}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SeriesDetail;
