import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:6543/api' });

// Tambahkan interceptor untuk set header Authorization dengan token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getFilms = () => API.get('/films');
export const getFilm = (id) => API.get(`/films/${id}`);
export const addFilm = (data) => API.post('/films', data);
export const updateFilm = (id, data) => API.put(`/films/${id}`, data);
export const deleteFilm = (id) => API.delete(`/films/${id}`);

export const getStatuses = () => API.get('/statuses');
export const addStatus = (data) => API.post('/statuses', data);
export const deleteStatus = (id) => API.delete(`/statuses/${id}`);

export const getReviews = () => API.get('/reviews');
export const addReview = (data) => API.post('/reviews', data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
