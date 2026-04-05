import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [temporadaData, setTemporadaData] = useState(null);
  const [temporadaSel, setTemporadaSel] = useState("1");
  const [isMovie, setIsMovie] = useState(false);

  const API_KEY = "844dba0bfd8f3a4f3799f6130ef9e335";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Primero intentamos buscar como Serie (TV)
        let res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=es-ES`);
        let json = await res.json();
        
        if (json.success === false) {
          // Si falla, es una Película (Movie)
          res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-ES`);
          json = await res.json();
          setIsMovie(true);
        } else {
          setIsMovie(false);
        }
        setData(json);
      } catch (err) {
        console.error("Error cargando contenido:", err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (data && !isMovie) {
      fetch(`https://api.themoviedb.org/3/tv/${id}/season/${temporadaSel}?api_key=${API_KEY}&language=es-ES`)
        .then(res => res.json())
        .then(setTemporadaData);
    }
  }, [data, temporadaSel, isMovie, id]);

  if (!data) return <div style={{padding: '100px', textAlign: 'center', color: 'white'}}>Cargando...</div>;

  // Link de reproducción para Películas (desde myLibrary o link genérico)
  const movieUrl = "https://photos.google.com/search/ChdBZ3JlZ2Fkb3MgcmVjaWVudGVtZW50ZSIIEgYKBHICCgAo3pTP19Uz/photo/AF1QipOz_RHrWy_TmsHwQfqFgTA7__1GlTmpJWRYHhFL"; // Link por defecto para Avatar

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white' }}>
      {/* Hero Header */}
      <div style={{ 
        height: '60vh', position: 'relative',
        backgroundImage: `linear-gradient(to top, #0f171e 10%, transparent 80%), linear-gradient(to right, #0f171e 25%, transparent 100%), url(https://image.tmdb.org/t/p/original${data.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%'
      }}>
        <div style={{ padding: '0 4%', position: 'absolute', bottom: '40px', maxWidth: '850px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900 }}>{data.name || data.title}</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', color: '#8197a4' }}>
             <span style={{ color: '#46d369', fontWeight: 'bold' }}>{data.vote_average?.toFixed(1)} ★</span>
             <span>{(data.first_air_date || data.release_date)?.split('-')[0]}</span>
             <span style={{ border: '1px solid #8197a4', padding: '0 8px', borderRadius: '4px' }}>18+</span>
             <span>{isMovie ? `${data.runtime} min` : `${data.number_of_seasons} Temporadas`}</span>
          </div>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.5', color: '#ccc', marginBottom: '30px' }}>{data.overview}</p>
          
          {isMovie ? (
            <a href={movieUrl} target="_blank" rel="noreferrer" style={{
              background: '#00a8e1', color: 'white', padding: '15px 40px', borderRadius: '5px', 
              textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', display: 'inline-block'
            }}>Reproducir Película</a>
          ) : (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
              {[...Array(data.number_of_seasons)].map((_, i) => (
                <button key={i} onClick={() => setTemporadaSel(i + 1)} style={{
                  background: temporadaSel == (i + 1) ? '#00a8e1' : 'rgba(255,255,255,0.08)',
                  color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px', cursor: 'pointer'
                }}>Temporada {i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid de Episodios (Solo si no es película) */}
      {!isMovie && (
        <div style={{ padding: '50px 4%' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '30px' }}>Episodios</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {temporadaData?.episodes?.map(ep => (
              <div key={ep.id} style={{ cursor: 'pointer' }}>
                 <img src={`https://image.tmdb.org/t/p/w500${ep.still_path || data.backdrop_path}`} style={{ width: '100%', borderRadius: '8px' }} />
                 <h3 style={{ fontSize: '1rem', marginTop: '10px' }}>{ep.episode_number}. {ep.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesDetail;
