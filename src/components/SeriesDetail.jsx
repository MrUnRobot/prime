import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const serie = mySeries.find(s => s.id === parseInt(id));

  if (!serie) return <div>Serie no encontrada</div>;

  return (
    <div style={{ padding: '20px 4%' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px', background: '#00a8e1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Volver</button>
      <h1>Temporada {serie.temporada}</h1>
      <div style={{ display: 'grid', gap: '15px' }}>
        {serie.capitulos.map((cap, index) => (
          <div key={index} style={{ background: '#1a242f', padding: '15px', borderRadius: '8px' }}>
            <h3>{cap.titulo}</h3>
            <video controls width="100%" style={{ borderRadius: '5px', marginTop: '10px' }}>
              <source src={cap.videoUrl} type="video/mp4" />
              Tu navegador no soporta video.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SeriesDetail;
