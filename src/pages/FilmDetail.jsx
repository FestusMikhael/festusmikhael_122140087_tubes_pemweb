import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFilmDetailOMDb } from '../api/omdbApi';
import axios from 'axios';
import { toast } from 'react-toastify';

const FilmDetail = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false); // loading state untuk tombol tambah

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const data = await getFilmDetailOMDb(id);
        if (data) {
          setFilm(data);
          setError(null);
        } else {
          setError('Film tidak ditemukan');
        }
      } catch {
        setError('Gagal memuat detail film');
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [id]);

  const handleAddToCollection = async () => {
    if (!film) return;
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Anda harus login terlebih dahulu.');
      return;
    }

    setAdding(true);
    try {
      // Kirim data film ke backend
      const filmResponse = await axios.post(
        'http://localhost:6543/api/films',
        {
          judul: film.Title,
          tahun: parseInt(film.Year) || null,
          sutradara: film.Director || '',
          genre: film.Genre || '',
          poster: film.Poster !== 'N/A' ? film.Poster : '',
          sinopsis: film.Plot || '',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Set status "Ingin Ditonton"
      await axios.post(
        'http://localhost:6543/api/statuses',
        {
          status: 'Ingin Ditonton',
          film_id: filmResponse.data.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`"${film.Title}" berhasil ditambahkan ke koleksi dengan status Ingin Ditonton!`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Gagal menambahkan film.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Memuat...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (!film) return <div className="p-6 text-red-400">Film tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        {film.Poster && film.Poster !== 'N/A' ? (
          <img
            src={film.Poster}
            alt={film.Title}
            className="w-full md:w-64 h-auto rounded"
          />
        ) : (
          <div className="w-full md:w-64 h-80 bg-yellow-400 text-black flex items-center justify-center font-bold rounded">
            No Poster
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">{film.Title}</h1>
          <p className="text-sm text-gray-400 mb-1">Tahun: {film.Year}</p>
          <p className="text-sm text-gray-400 mb-1">Sutradara: {film.Director}</p>
          <p className="text-sm text-gray-400 mb-1">Genre: {film.Genre}</p>
          <p className="mt-4">{film.Plot}</p>

          <button
            onClick={handleAddToCollection}
            disabled={adding}
            className={`mt-6 bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-300 ${
              adding ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {adding ? 'Menambahkan...' : 'Tambah ke Koleksi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilmDetail;
