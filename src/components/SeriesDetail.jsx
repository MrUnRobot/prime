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
      className="page-wrapper"
    >
      {/* Botón Volver alineado a la izquierda */}
      <button onClick={() => navigate(-1)} className="nav-back">
        ‹ Volver al Inicio
      </button>

      <div className="main-layout">
        {/* LADO IZQUIERDO: Poster fijo */}
        <div className="poster-container">
          <img 
            src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} 
            className="series-poster"
            alt="Poster" 
          />
        </div>
        
        {/* LADO DERECHO: Toda la información alineada a la izquierda */}
        <div className="content-container">
          <h1 className="main-title">{data.name}</h1>
          
          <div className="meta-row">
            <span className="accent-text">Temporada {seriesInfo.temporada}</span>
            <span className="dot">•</span>
            <span>{data.first_air_date.split('-')[0]}</span>
            <span className="dot">•</span>
            <span className="rating-tag">18+</span>
          </div>

          <p className="summary-text">{data.overview}</p>
          
          <div className="button-group">
            <button className="primary-btn">▶ Reproducir Episodio 1</button>
            <button className="secondary-btn">+ Mi Lista</button>
          </div>

          <div className="episodes-section">
            <h3 className="sub-header">Episodios</h3>
            <div className="episode-list">
              {seriesInfo.capitulos.map((cap, i) => {
                const apiEp = episodes[i];
                return (
                  <motion.a 
                    key={i} href={cap.videoUrl} target="_blank" rel="noreferrer"
                    className="episode-item"
                    whileHover={{ backgroundColor: '#2a343f' }}
                  >
                    <div className="ep-image-box">
                      <img 
                        src={`https://image.tmdb.org/t/p/w300${apiEp?.still_path || data.backdrop_path}`} 
                        className="ep-thumb"
                      />
                    </div>
                    <div className="ep-text-box">
                      <h4 className="ep-title">{i + 1}. {apiEp?.name || cap.titulo || `Episodio ${i+1}`}</h4>
                      <p className="ep-desc">{apiEp?.overview || "Reproducir contenido de la temporada."}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .page-wrapper {
          max-width: 1300px;
          margin: 0 auto;
          padding: 40px 5% 100px 5%;
          color: white;
        }

        .nav-back {
          background: none; border: none; color: #00a8e1;
          font-size: 1.1rem; cursor: pointer; padding: 0;
          margin-bottom: 30px; display: block;
        }

        .main-layout {
          display: flex;
          gap: 50px;
          align-items: flex-start;
        }

        .poster-container {
          width: 300px;
          flex-shrink: 0;
        }

        .series-poster {
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.6);
        }

        .content-container {
          flex: 1;
          text-align: left; /* TODO ALINEADO A LA IZQUIERDA */
        }

        .main-title {
          font-size: 3.5rem;
          margin: 0 0 15px 0;
          line-height: 1;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
          font-weight: 600;
          color: #8197a4;
        }

        .accent-text { color: #00a8e1; }
        .dot { font-size: 1.5rem; line-height: 0; }
        .rating-tag { 
          border: 1px solid #444; 
          padding: 2px 8px; 
          font-size: 0.8rem; 
          border-radius: 3px; 
        }

        .summary-text {
          font-size: 1.15rem;
          line-height: 1.6;
          color: #ccc;
          margin-bottom: 35px;
          max-width: 850px;
        }

        .button-group {
          display: flex;
          gap: 15px;
          margin-bottom: 60px;
        }

        .primary-btn {
          background: #fff; color: #000; border: none;
          padding: 14px 35px; border-radius: 4px;
          font-weight: bold; font-size: 1.1rem; cursor: pointer;
        }

        .secondary-btn {
          background: #33373d; color: #fff; border: none;
          padding: 14px 25px; border-radius: 4px;
          font-weight: bold; font-size: 1.1rem; cursor: pointer;
        }

        .sub-header {
          font-size: 1.8rem;
          margin-bottom: 25px;
          border-bottom: 1px solid #333;
          padding-bottom: 10px;
        }

        .episode-list { display: grid; gap: 12px; }

        .episode-item {
          display: flex;
          gap: 20px;
          padding: 12px;
          background: #1a242f;
          border-radius: 8px;
          text-decoration: none;
          color: white;
          align-items: center;
        }

        .ep-image-box {
          width: 180px;
          flex-shrink: 0;
          border-radius: 6px;
          overflow: hidden;
        }

        .ep-thumb { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }

        .ep-text-box { flex: 1; }
        .ep-title { margin: 0 0 5px 0; font-size: 1.2rem; color: #00a8e1; }
        .ep-desc { 
          margin: 0; font-size: 0.9rem; color: #8197a4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        /* --- RESPONSIVO --- */
        @media (max-width: 1000px) {
          .main-layout { flex-direction: column; align-items: flex-start; }
          .poster-container { width: 220px; }
          .main-title { font-size: 2.5rem; }
        }

        @media (max-width: 600px) {
          .episode-item { flex-direction: column; align-items: flex-start; }
          .ep-image-box { width: 100%; }
        }
      `}</style>
    </motion.div>
  );
};

export default SeriesDetail;
