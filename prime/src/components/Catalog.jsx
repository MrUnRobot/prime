import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const Catalog = () => {
  const navigate = useNavigate();
  const [seriesData, setSeriesData] = useState([]);
  const API_KEY = "844dba0bfd8f3a4f3799f6130ef9e335";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          mySeries.map(async (s) => {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${s.tmdbId}?api_key=${API_KEY}&language=es-ES`);
            const data = await res.json();
            return { ...s, ...data };
          })
        );
        setSeriesData(results);
      } catch (err) { console.error(err); }
    };
    fetchAll();
  }, []);

  if (seriesData.length === 0) return <div style={{padding: '50px', textAlign: 'center'}}>Cargando Prime G...</div>;

  return (
    <div style={{ padding: '40px 4%' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '25px' }}>Series para ti</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {seriesData.map((serie) => (
          <div key={serie.id} onClick={() => navigate(`/series/${serie.tmdbId}`)} style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', background: '#1a242f' }}>
            <img src={`https://image.tmdb.org/t/p/w500${serie.backdrop_path}`} alt={serie.name} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
            <p style={{ padding: '12px', margin: 0, fontWeight: 'bold' }}>{serie.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Catalog;
