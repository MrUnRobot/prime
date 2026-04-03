import React from 'react';

const MovieRow = ({ title, items }) => {
  return (
    <div className="row-container" style={{ padding: '20px', background: '#111', color: 'white' }}>
      <h2>{title}</h2>
      <div style={{ display: 'flex', overflowX: 'scroll', gap: '10px', padding: '10px 0' }}>
        {items.map((item) => (
          <div key={item.id} style={{ minWidth: '200px', cursor: 'pointer' }}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
              alt={item.name} 
              style={{ width: '100%', borderRadius: '4px', transition: 'transform 0.3s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            <p style={{ fontSize: '14px', textAlign: 'center' }}>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
