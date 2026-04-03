import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serie, setSerie] = useState(null);
  const [infoExtra, setInfoExtra] = useState(null);

  useEffect(() => {
    // Buscamos la serie en nuestro archivo local (comparamos de forma segura)
    const encontrada = mySeries.find(s => String(s.id) === String(id));
    
    if (encontrada) {
      setSerie(encontrada);
      // Traer sinopsis y datos reales de TMDB
      fetch(`https://api.themoviedb.org/3/tv/${encontrada.tmdbId}?api_key=844dba0bfd8f3a4f3799f6130ef9e335&language=es-ES`)
        .then(res => res.json())
        .then(data => setInfoExtra(data))
        .catch(err => console.error("Error API:", err));
    }
  }, [id]);

  if (!serie) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>Serie no encontrada (ID: {id})</h2>
        <button onClick={() => navigate('/')} style={{ background: '#00a8e1', border: 'none', padding: '10px 20px', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>Volver al Inicio</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e', color: 'white' }}>
      {/* Hero Section con Sinopsis */}
      <div style={{ 
        padding: '60px 4% 40px', 
        background: 'linear-gradient(to bottom, rgba(27,37,48,1) 0%, rgba(15,23,30,1) 100%)',
        borderBottom: '1px solid #252e39' 
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', color: '#00a8e1', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>← Volver</button>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>{infoExtra?.name || serie.tituloManual}</h1>
        <div style={{ display: 'flex', gap: '15px', color: '#8197a4', marginBottom: '20px' }}>
          <span>{infoExtra?.first_air_date?.split('-')[0]}</span>
          <span style={{ border: '1px solid #8197a4', padding: '0 5px', borderRadius: '3px' }}>18+</span>
          <span>Temporada {serie.temporada}</span>
        </div>
        <p style={{ maxWidth: '800px', fontSize: '1.2rem', lineHeight: '1.6', color: '#ccc' }}>
          {infoExtra?.overview || "Cargando sinopsis..."}
        </p>
      </div>

      {/* Lista de Capítulos */}
      <div style={{ padding: '40px 4%' }}>
        <h2 style={{ marginBottom: '30px' }}>Episodios</h2>
        <div style={{ display: 'grid', gap: '25px' }}>
          {serie.capitulos.map((cap, index) => (
            <div key={index} style={{ background: '#1b2530', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #252e39' }}>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>{index + 1}. {cap.titulo}</h3>
                <div style={{ position: 'relative', width: '100%', maxWidth: '900px', aspectRatio: '16/9', background: '#000' }}>
                  <video controls style={{ width: '100%', height: '100%' }}>
                    <source src={cap.videoUrl} type="video/mp4" />
                    Tu navegador no soporta video.
                  </video>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
