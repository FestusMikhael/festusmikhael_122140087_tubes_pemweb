import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:6543/api' });  // Sesuaikan dengan URL API backend Anda

export const getStatuses = () => {
  return API.get('/statuses'); // Mengambil daftar status dari endpoint API
};
