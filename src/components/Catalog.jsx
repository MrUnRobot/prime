import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingMovies } from '../services/tmdb';

const Catalog = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTrendingMovies().then(setMovies);
  }, []);

  return (
    <div style={{ padding: '40px 4%', backgroundColor: '#0f171e' }}>
      {/* Banner Principal de Bienvenida */}
      <div style={{
        height: '400px',
        borderRadius: '20px',
        marginBottom: '50px',
        backgroundImage: 'linear-gradient(to right, #0f171e, transparent), url(https://image.tmdb.org/t/p/original/969U9AF3Qw0pY7zVQSOfm7f9BIn.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 50px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 10px 0' }}>Bienvenido a Prime G</h2>
        <p style={{ fontSize: '1.2rem', color: '#8197a4', maxWidth: '500px' }}>
          Tus series y películas favoritas, con la mejor calidad y una experiencia única.
        </p>
      </div>

      <h2 style={{ color: '#00a8e1', marginBottom: '30px', fontSize: '1.8rem', fontWeight: 700 }}>Tendencias para ti</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '25px' 
      }}>
        {movies.map(movie => (
          <div 
            key={movie.id} 
            onClick={() => navigate(`/series/${movie.id}`)}
            style={{ 
              cursor: 'pointer',
              transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#1a242f',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.border = '1px solid #00a8e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)';
            }}
          >
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              style={{ width: '100%', display: 'block', height: '320px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '15px', background: 'linear-gradient(to top, #1a242f, transparent)' }}>
              <h3 style={{ fontSize: '1rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {movie.title || movie.name}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#00a8e1', fontWeight: 'bold' }}>{movie.vote_average.toFixed(1)} ★</span>
                <span style={{ fontSize: '0.8rem', color: '#8197a4' }}>{movie.release_date?.split('-')[0] || 'Serie'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
