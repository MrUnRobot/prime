import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serie, setSerie] = useState(null);

  useEffect(() => {
    // Buscamos la serie asegurando que ambos sean números
    const found = mySeries.find(s => Number(s.id) === Number(id));
    setSerie(found);
  }, [id]);

  if (!serie) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Serie no encontrada</h2>
        <button onClick={() => navigate('/')} style={{ background: '#00a8e1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f171e' }}>
      {/* Banner Superior */}
      <div style={{ padding: '40px 4% 20px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', color: '#8197a4', border: 'none', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}>
          ← Volver
        </button>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>Invencible</h1>
        <p style={{ color: '#00a8e1', fontWeight: 'bold', fontSize: '1.2rem' }}>Temporada {serie.temporada}</p>
      </div>

      {/* Lista de Capítulos */}
      <div style={{ padding: '0 4% 40px' }}>
        <h2 style={{ borderBottom: '1px solid #252e39', paddingBottom: '10px', marginBottom: '20px' }}>Episodios</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {serie.capitulos.map((cap, index) => (
            <div key={index} style={{ background: '#1a242f', borderRadius: '8px', overflow: 'hidden', border: '1px solid #252e39' }}>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>{index + 1}. {cap.titulo}</h3>
                
                <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: '4px' }}>
                  <video 
                    controls 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    poster="https://image.tmdb.org/t/p/original/969m09v3vS3uS0eREPre8p97p67.jpg"
                  >
                    <source src={cap.videoUrl} type="video/mp4" />
                    Tu navegador no soporta el video.
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
