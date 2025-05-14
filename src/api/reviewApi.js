import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:6543/api' });  // Sesuaikan dengan URL API backend Anda

export const getReviews = () => {
  return API.get('/reviews'); // Mengambil daftar semua review
};

export const getReview = (id) => {
  return API.get(`/reviews/${id}`); // Mengambil review berdasarkan ID
};

export const addReview = (data) => {
  return API.post('/reviews', data); // Menambahkan review baru
};

export const deleteReview = (id) => {
  return API.delete(`/reviews/${id}`); // Menghapus review berdasarkan ID
};
