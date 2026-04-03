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
      className="detail-container"
    >
      <button onClick={() => navigate(-1)} className="back-button">
        ‹ Volver
      </button>

      {/* Header Responsivo */}
      <div className="header-section">
        <img 
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} 
          className="main-poster"
          alt="Poster" 
        />
        
        <div className="info-content">
          <h1 className="series-title">{data.name}</h1>
          <div className="meta-info">
            <span className="season-badge">Temporada {seriesInfo.temporada}</span>
            <span className="year-text">{data.first_air_date.split('-')[0]}</span>
            <span className="age-rating">18+</span>
          </div>
          <p className="description-text">{data.overview}</p>
          
          <div className="action-buttons">
            <button className="play-btn">▶ Reproducir</button>
            <button className="list-btn">+ Mi lista</button>
          </div>
        </div>
      </div>

      {/* Lista de Episodios */}
      <div style={{ width: '100%', marginTop: '40px' }}>
        <h3 className="section-subtitle">Episodios</h3>
        <div className="episodes-grid">
          {seriesInfo.capitulos.map((cap, i) => {
            const apiEp = episodes[i];
            return (
              <motion.a 
                key={i} 
                href={cap.videoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="episode-card"
                whileHover={{ scale: 1.01 }}
              >
                <div className="episode-thumb-container">
                  <img 
                    src={`https://image.tmdb.org/t/p/w300${apiEp?.still_path || data.backdrop_path}`} 
                    className="episode-thumb"
                  />
                  <div className="play-overlay">▶</div>
                </div>
                <div className="episode-info">
                  <h4 className="episode-name">{i + 1}. {apiEp?.name || cap.titulo || `Episodio ${i+1}`}</h4>
                  <p className="episode-desc">{apiEp?.overview || "Haz clic para ver este capítulo de la Temporada " + seriesInfo.temporada}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      <style>{`
        .detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 5% 100px 5%;
        }

        .back-button {
          background: none; border: none; color: #00a8e1; 
          cursor: pointer; margin-bottom: 20px; font-size: 1.2rem;
        }

        .header-section {
          display: flex;
          gap: 40px;
          margin-bottom: 50px;
        }

        .main-poster {
          width: 300px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          height: fit-content;
        }

        .series-title {
          font-size: 3.5rem;
          margin: 0 0 15px 0;
          font-weight: 800;
        }

        .meta-info {
          display: flex; gap: 15px; align-items: center; 
          margin-bottom: 25px; font-weight: bold;
        }

        .season-badge { color: #00a8e1; font-size: 1.2rem; }
        .age-rating { border: 1px solid #8197a4; padding: 2px 8px; font-size: 0.8rem; color: #8197a4; }

        .description-text {
          line-height: 1.6; color: #ccc; font-size: 1.1rem;
          max-width: 800px; margin-bottom: 30px;
        }

        .action-buttons { display: flex; gap: 15px; flex-wrap: wrap; }
        
        .play-btn {
          background: #00a8e1; color: black; border: none;
          padding: 12px 30px; font-size: 1.1rem; font-weight: bold;
          border-radius: 4px; cursor: pointer;
        }

        .list-btn {
          background: #333; color: white; border: none;
          padding: 12px 20px; font-size: 1.1rem; border-radius: 4px; cursor: pointer;
        }

        .episodes-grid { display: grid; gap: 15px; width: 100%; }

        .episode-card {
          display: flex; gap: 20px; padding: 15px;
          background: #1a242f; border-radius: 8px;
          text-decoration: none; color: white; align-items: center;
          transition: background 0.3s;
        }
        .episode-card:hover { background: #252e39; }

        .episode-thumb-container {
          width: 200px; flex-shrink: 0; position: relative;
          border-radius: 4px; overflow: hidden;
        }

        .episode-thumb { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
        
        .play-overlay {
          position: absolute; inset: 0; display: flex; align-items: center; 
          justify-content: center; background: rgba(0,0,0,0.3); opacity: 0; transition: 0.3s;
        }
        .episode-card:hover .play-overlay { opacity: 1; }

        .episode-name { margin: 0 0 5px 0; color: #00a8e1; }
        .episode-desc { 
          margin: 0; font-size: 0.9rem; color: #8197a4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        /* ----- RESPONSIVE DESIGN (Media Queries) ----- */

        @media (max-width: 900px) {
          .header-section { flex-direction: column; align-items: center; text-align: center; }
          .series-title { font-size: 2.5rem; }
          .description-text { margin: 0 auto 30px auto; }
          .action-buttons { justify-content: center; }
          .meta-info { justify-content: center; }
        }

        @media (max-width: 600px) {
          .episode-card { flex-direction: column; align-items: flex-start; }
          .episode-thumb-container { width: 100%; }
          .main-poster { width: 200px; }
          .series-title { font-size: 2rem; }
        }
      `}</style>
    </motion.div>
  );
};

export default SeriesDetail;
