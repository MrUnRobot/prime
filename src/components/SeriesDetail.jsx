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
      // 1. Traer info de la serie
      fetch(`https://api.themoviedb.org/3/tv/${seriesInfo.tmdbId}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json()).then(json => setData(json));

      // 2. Traer nombres de capítulos de la temporada
      fetch(`https://api.themoviedb.org/3/tv/${seriesInfo.tmdbId}/season/${seriesInfo.temporada}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json()).then(json => setEpisodes(json.episodes || []));
    }
  }, [seriesInfo]);

  if (!data) return <div style={{padding: '100px', color: '#00a8e1'}}>Cargando...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 4%', paddingBottom: '100px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#00a8e1', cursor: 'pointer', marginBottom: '20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{fontSize: '1.5rem'}}>‹</span> Volver
      </button>

      {/* Banner Principal */}
      <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap', marginBottom: '60px' }}>
        <motion.img 
          initial={{ x: -20 }} animate={{ x: 0 }}
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} 
          style={{ width: '320px', borderRadius: '15px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }} 
        />
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>{data.name}</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#00a8e1', fontWeight: 'bold' }}>Temporada {seriesInfo.temporada}</span>
            <span style={{ color: '#8197a4' }}>{data.first_air_date.split('-')[0]}</span>
            <span style={{ border: '1px solid #8197a4', padding: '2px 6px', fontSize: '0.8rem', color: '#8197a4' }}>18+</span>
          </div>
          <p style={{ lineHeight: '1.8', color: '#ccc', maxWidth: '850px', fontSize: '1.1rem' }}>{data.overview}</p>
        </div>
      </div>

      {/* Lista de Episodios Pulida */}
      <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>Episodios</h3>
      <div style={{ display: 'grid', gap: '15px' }}>
        {seriesInfo.capitulos.map((cap, i) => {
          const apiEp = episodes[i] || { name: `Episodio ${i + 1}`, overview: "Sin descripción disponible." };
          return (
            <motion.a 
              key={i} href={cap.videoUrl} target="_blank" rel="noreferrer"
              whileHover={{ x: 10, backgroundColor: '#252e39' }}
              style={{
                display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#1a242f',
                borderRadius: '12px', textDecoration: 'none', color: 'white', alignItems: 'center'
              }}
            >
              <div style={{ position: 'relative', width: '200px', flexShrink: 0 }}>
                <img 
                  src={`https://image.tmdb.org/t/p/w300${apiEp.still_path || data.backdrop_path}`} 
                  style={{ width: '100%', borderRadius: '8px' }} 
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid white', marginLeft: '4px' }}></div>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#00a8e1' }}>{i + 1}. {apiEp.name}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {apiEp.overview}
                </p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SeriesDetail;
