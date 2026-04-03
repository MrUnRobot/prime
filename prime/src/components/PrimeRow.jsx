import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PrimeRow = ({ series }) => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/tv/${series.tmdbId}?api_key=844dba0bfd8f3a4f3799f6130ef9e335&language=es-ES`)
      .then(res => res.json()).then(json => setData(json));
  }, [series.tmdbId]);

  if (!data) return null;

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      onClick={() => navigate(`/serie/${series.id}`)}
      style={{ 
        width: '200px', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden',
        border: '2px solid transparent'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#00a8e1'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
    >
      <img src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} alt={data.name} style={{ width: '100%' }} />
    </motion.div>
  );
};

export default PrimeRow;
