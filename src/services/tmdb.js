const API_KEY = "844dba0bfd8f3a4f3799f6130ef9e335";
const BASE_URL = "https://api.themoviedb.org/3";

export const getTrendingMovies = async () => {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  return data.results;
};
