import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';
import { motion } from 'framer-motion';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  
  const seriesInfo = mySeries.find(s => s.id === parseInt(id));

  useEffect(() => {
    if (seriesInfo) {
      fetch(`https://api.themoviedb.org/3/tv/${seriesInfo.tmdbId}?api_key=844dba0bfd8f3a4f3799f6130ef9e335&language=es-ES`)
        .then(res => res.json()).then(json => setData(json));
    }
  }, [seriesInfo]);

  if (!data) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 4%' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'none', border: 'none', color: '#00a8e1', cursor: 'pointer', marginBottom: '20px' }}
      >
        ← Volver
      </button>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <img src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} style={{ width: '280px', borderRadius: '10px' }} />
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>{data.name}</h1>
          <p style={{ color: '#8197a4' }}>Temporada {seriesInfo.temporada}</p>
          <p style={{ lineHeight: '1.6', color: '#ccc', maxWidth: '800px' }}>{data.overview}</p>
          
          <div style={{ marginTop: '30px' }}>
             <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Episodios</h3>
             {seriesInfo.capitulos.map((cap, i) => (
               <a key={i} href={cap.videoUrl} target="_blank" rel="noreferrer" style={{
                 display: 'flex', padding: '15px', backgroundColor: '#1a242f', marginBottom: '8px',
                 borderRadius: '5px', textDecoration: 'none', color: 'white'
               }}>
                 <span style={{ color: '#00a8e1', marginRight: '15px' }}>{i+1}</span> {cap.titulo}
               </a>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SeriesDetail;
