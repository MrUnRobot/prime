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
      // Info general de la serie
      fetch(`https://api.themoviedb.org/3/tv/${seriesInfo.tmdbId}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json()).then(json => setData(json));

      // Info específica de la TEMPORADA configurada
      fetch(`https://api.themoviedb.org/3/tv/${seriesInfo.tmdbId}/season/${seriesInfo.temporada}?api_key=${API_KEY}&language=es-ES`)
        .then(res => {
          if (!res.ok) throw new Error('Temporada no encontrada en API');
          return res.json();
        })
        .then(json => setEpisodes(json.episodes || []))
        .catch(() => setEpisodes([])); // Si falla, usamos los datos locales
    }
  }, [seriesInfo]);

  if (!data) return <div style={{padding: '100px', color: '#00a8e1'}}>Cargando Temporada {seriesInfo?.temporada}...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 4%', paddingBottom: '100px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#00a8e1', cursor: 'pointer', marginBottom: '20px', fontSize: '1.1rem' }}>
        ‹ Volver
      </button>

      <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap', marginBottom: '60px' }}>
        <img src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} style={{ width: '300px', borderRadius: '15px' }} alt="Poster" />
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0' }}>{data.name}</h1>
          <p style={{ color: '#00a8e1', fontWeight: 'bold', fontSize: '1.2rem' }}>Temporada {seriesInfo.temporada}</p>
          <p style={{ lineHeight: '1.8', color: '#ccc', maxWidth: '800px' }}>{data.overview}</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Episodios (T{seriesInfo.temporada})</h3>
      <div style={{ display: 'grid', gap: '12px' }}>
        {seriesInfo.capitulos.map((cap, i) => {
          // Si la API tiene el episodio, usamos su nombre, si no, el del archivo local
          const apiName = episodes[i]?.name || cap.titulo || `Episodio ${i + 1}`;
          const apiOverview = episodes[i]?.overview || "Reproducir contenido de la Temporada " + seriesInfo.temporada;
          
          return (
            <motion.a 
              key={i} href={cap.videoUrl} target="_blank" rel="noreferrer"
              whileHover={{ x: 8, backgroundColor: '#252e39' }}
              style={{
                display: 'flex', gap: '20px', padding: '15px', backgroundColor: '#1a242f',
                borderRadius: '10px', textDecoration: 'none', color: 'white', alignItems: 'center'
              }}
            >
              <div style={{ width: '160px', height: '90px', backgroundColor: '#0f171e', borderRadius: '5px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={`https://image.tmdb.org/t/p/w300${episodes[i]?.still_path || data.backdrop_path}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', padding: '2px 5px', fontSize: '0.7rem' }}>T4:E{i+1}</div>
              </div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{i + 1}. {apiName}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8197a4' }}>{apiOverview}</p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SeriesDetail;
