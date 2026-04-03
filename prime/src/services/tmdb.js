import axios from 'axios';

const API_KEY = 'TU_API_KEY_AQUI'; // Reemplaza con tu llave de TMDB
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMetadata = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/tv`, {
      params: { api_key: API_KEY, query: title, language: 'es-ES' }
    });
    return response.data.results[0];
  } catch (error) {
    console.error("Error obteniendo metadatos:", error);
  }
};
