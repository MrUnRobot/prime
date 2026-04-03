import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serie, setSerie] = useState(null);
  const [tmdb, setTmdb] = useState(null);
  const [temporadaSel, setTemporadaSel] = useState("4");

  useEffect(() => {
    const found = mySeries.find(s => String(s.id) === String(id));
    if (found) {
      setSerie(found);
      fetch(`https://api.themoviedb.org/3/tv/${found.tmdbId}?api_key=844dba0bfd8f3a4f3799f6130ef9e335\&language=es-ES`)
        .then(res => res.json())
        .then(data => setTmdb(data));
    }
  }, [id]);

  if (!serie || !tmdb) return <div style={{padding: '100px', textAlign: 'center'}}>Cargando experiencia...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e' }}>
      {/* Hero Header */}
      <div style={{ 
        height: '70vh', position: 'relative',
        backgroundImage: `linear-gradient(to top, #0f171e 5%, transparent 60%), linear-gradient(to right, #0f171e 20%, transparent 100%), url(https://image.tmdb.org/t/p/original${tmdb.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%'
      }}>
        <div style={{ padding: '0 4%', position: 'absolute', bottom: '40px', maxWidth: '900px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '15px', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>{tmdb.name}</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#46d369', fontWeight: 'bold' }}>{tmdb.vote_average?.toFixed(1)} Rating</span>
            <span style={{ background: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>HD</span>
            <span style={{ color: '#8197a4' }}>{tmdb.first_air_date?.split('-')[0]}</span>
          </div>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#e5e5e5', textShadow: '1px 1px 5px rgba(0,0,0,0.8)' }}>{tmdb.overview}</p>
          
          <div style={{ marginTop: '30px' }}>
            <select 
              value={temporadaSel} 
              onChange={(e) => setTemporadaSel(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', outline: 'none', backdropFilter: 'blur(5px)' }}
            >
              {serie.temporadasDisponibles.map(t => <option key={t} value={t} style={{background: '#0f171e'}}>Temporada {t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Episodios */}
      <div style={{ padding: '60px 4%' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px', color: '#00a8e1' }}>Episodios</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {serie.capitulos[temporadaSel]?.map((cap, index) => (
            <div key={index} style={{ 
              display: 'flex', gap: '30px', background: 'rgba(25, 37, 48, 0.5)', padding: '25px', 
              borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s'
            }}>
              <div style={{ position: 'relative', width: '280px', flexShrink: 0, overflow: 'hidden', borderRadius: '10px' }}>
                <img src={`https://image.tmdb.org/t/p/w500${tmdb.backdrop_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,168,225,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(0,168,225,0.5)' }}>▶</div>
                </div>
              </div>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{index + 1}. {cap.titulo}</h3>
                <p style={{ color: '#8197a4', fontSize: '1rem', marginBottom: '20px', maxWidth: '800px' }}>{cap.sinopsis}</p>
                <a 
                  href={cap.url} target="_blank" rel="noopener noreferrer"
                  style={{ 
                    alignSelf: 'flex-start',
                    background: 'linear-gradient(90deg, #00a8e1 0%, #007eb9 100%)',
                    color: 'white', padding: '12px 35px', borderRadius: '50px', 
                    textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem',
                    boxShadow: '0 4px 15px rgba(0,168,225,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  REPRODUCIR AHORA
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
