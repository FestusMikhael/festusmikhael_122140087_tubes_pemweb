import axios from 'axios';

const OMDB_API_KEY = '4ace9a51'; // Ganti dengan API key kamu

// Fungsi untuk mencari film dari OMDB API
export const searchFilmOMDb = async (query) => {
  try {
    const response = await axios.get(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`);
    
    if (response.data.Response === "True") {
      return response.data.Search || [];
    } else {
      console.error('Error: ', response.data.Error); // Log error jika ada
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch data from OMDB:', error);
    return [];
  }
};

// Fungsi untuk mendapatkan detail film berdasarkan IMDb ID dari OMDB API
export const getFilmDetailOMDb = async (imdbID) => {
  try {
    const response = await axios.get(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`);
    
    if (response.data.Response === "True") {
      return response.data;
    } else {
      console.error('Error: ', response.data.Error); // Log error jika ada
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch film details from OMDB:', error);
    return null;
  }
};
