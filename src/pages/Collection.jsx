import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Collection = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk ambil data film user dengan token
  const fetchFilms = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token tidak ditemukan, silakan login ulang.');
      setFilms([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:6543/api/films', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Asumsi backend mengirim { films: [...] }
      if (res.data && Array.isArray(res.data.films)) {
        setFilms(res.data.films);
      } else if (Array.isArray(res.data)) {
        // Jika backend langsung kirim array film
        setFilms(res.data);
      } else {
        setFilms([]);
        setError('Format data koleksi film tidak valid.');
        console.error('Response data unexpected:', res.data);
      }
    } catch (err) {
      console.error('Gagal mengambil film:', err);
      setError('Gagal memuat koleksi film.');
      setFilms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  // Fungsi hapus film dan refresh list
const handleDelete = async (id, judul) => {
  const confirmed = window.confirm(`Yakin hapus film "${judul}" dari koleksi?`);
  if (!confirmed) return;

  const token = localStorage.getItem('token');
  console.log('Current token:', token);
  if (!token) {
    toast.error('Token tidak ditemukan, silakan login ulang.');
    return;
  }

  try {
    const response = await axios.delete(`http://localhost:6543/api/films/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.data && response.data.message) {
      toast.success(response.data.message);
    } else {
      toast.success(`Film "${judul}" berhasil dihapus.`);
    }
    
    fetchFilms(); // Refresh list
  } catch (err) {
    console.error('Gagal menghapus film:', err);
    toast.error(err.response?.data?.error || 'Gagal menghapus film.');
  }
};

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">Koleksi Film Saya</h1>

      {loading && <p className="text-gray-400">Memuat koleksi...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && films.length === 0 && !error && (
        <p className="text-gray-400">Belum ada film di koleksi.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {films.map((film) => (
          <div key={film.id} className="bg-[#1a1a1a] rounded p-2 relative">
            {film.poster ? (
              <img
                src={film.poster}
                alt={film.judul}
                className="w-full h-[400px] object-cover rounded"
              />
            ) : (
              <div className="w-full h-[400px] bg-yellow-400 flex items-center justify-center text-black font-bold">
                No Cover
              </div>
            )}

            <div className="mt-2 text-sm text-yellow-400 font-semibold">{film.judul}</div>
            <div className="text-xs text-gray-400">{film.tahun}</div>

            <button
              onClick={() => handleDelete(film.id, film.judul)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-md"
              title="Hapus dari Koleksi"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;
