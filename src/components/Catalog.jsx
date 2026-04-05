import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mySeries } from '../data/myLibrary';

const Catalog = () => {
  const [items, setItems] = useState([]);
  const API_KEY = "844dba0bfd8f3a4f3799f6130ef9e335";

  useEffect(() => {
    const fetchMetadata = async () => {
      const data = await Promise.all(mySeries.map(async (item) => {
        const type = item.type === 'movie' ? 'movie' : 'tv';
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${item.tmdbId}?api_key=${API_KEY}&language=es-ES`);
        const json = await res.json();
        return { ...item, ...json };
      }));
      setItems(data);
    };
    fetchMetadata();
  }, []);

  return (
    <div style={{ backgroundColor: '#0f171e', minHeight: '100vh', padding: '20px 4%' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Mi Librería</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        {items.map((item) => (
          <Link key={item.id} to={`/series/${item.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                alt={item.title || item.name} 
                style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
              />
              <p style={{ color: 'white', marginTop: '10px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {item.title || item.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
