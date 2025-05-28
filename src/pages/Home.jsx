import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFilmOMDb } from '../api/omdbApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getFilmDetailOMDb } from '../api/omdbApi';

// Komponen untuk placeholder jika poster film tidak ditemukan
const CoverNotFoundSmall = () => (
  <div className="w-10 h-14 bg-yellow-400 flex items-center justify-center text-black font-semibold rounded text-xs">
    No Cover
  </div>
);

// Komponen untuk placeholder poster ukuran besar saat poster tidak ada
const CoverNotFoundLarge = () => (
  <div className="w-full h-72 bg-yellow-400 flex flex-col items-center justify-center text-black px-4 rounded">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 mb-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="font-bold text-xl">Cover Not Found</span>
    <span className="text-sm mt-1">Sorry, no poster available</span>
  </div>
);

const Home = () => {
  const [recommended, setRecommended] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Ambil rekomendasi film default (kata kunci 'Marvel') saat komponen mount
  useEffect(() => {
    searchFilmOMDb('Marvel').then(data => {
      setRecommended(data);
    });
  }, []);

  // Debounce pencarian film berdasarkan input search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim() !== '') {
        searchFilmOMDb(search).then(setSearchResults);
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fungsi ketika user klik tombol tambah ke koleksi
const handleAddToCollection = async (film) => {
  const token = localStorage.getItem('token');
  
  const filmDetail = await getFilmDetailOMDb(film.imdbID);
  if (!filmDetail) {
    toast.error('Gagal mengambil detail film');
    return;
  }

  try {
    // Tambahkan film ke koleksi
    const filmResponse = await axios.post('http://localhost:6543/api/films', {
      judul: filmDetail.Title,
      tahun: parseInt(filmDetail.Year) || null,
      sutradara: filmDetail.Director || '',
      genre: filmDetail.Genre || '',
      poster: filmDetail.Poster || '',
      sinopsis: filmDetail.Plot || '',
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Set status "Ingin Ditonton" secara otomatis
    await axios.post('http://localhost:6543/api/statuses', {
      status: 'Ingin Ditonton',
      film_id: filmResponse.data.id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success(`"${filmDetail.Title}" berhasil ditambahkan ke koleksi dengan status Ingin Ditonton!`);
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.error || 'Gagal menambahkan film.');
  }
};

  const handleLogout = () => {
  localStorage.removeItem('token'); // Hapus token dari localStorage
  toast.success('Logout berhasil!');
  navigate('/login'); // Arahkan ke halaman login
};

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-[#1a1a1a] p-4 flex justify-between items-center">
        <div className="text-yellow-400 font-bold text-xl">FilmKu</div>
        <div className="text-white text-lg hidden sm:block">Rekomendasi Film</div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Cari film..."
            className="w-full p-2 rounded bg-[#333] text-white placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <ul className="absolute top-full left-0 right-0 z-20 bg-[#1a1a1a] mt-1 rounded shadow-lg max-h-80 overflow-y-auto border border-gray-700">
              {searchResults.map((film) => (
                <li
                  key={film.imdbID}
                  className="flex items-center gap-2 p-2 border-b border-gray-700 hover:bg-[#2a2a2a] cursor-pointer"
                  onClick={() => navigate(`/films/${film.imdbID}`)}
                >
                  {film.Poster !== 'N/A' ? (
                    <img src={film.Poster} alt={film.Title} className="w-10 h-auto rounded" />
                  ) : (
                    <CoverNotFoundSmall />
                  )}
                  <div>
                    <div className="text-sm font-medium">{film.Title}</div>
                    <div className="text-xs text-gray-400">{film.Year}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* Konten utama */}
      <main className="max-w-screen-xl mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Rekomendasi Film</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {recommended.slice(0, 8).map((film) => (
            <div
              key={film.imdbID}
              onClick={() => navigate(`/films/${film.imdbID}`)}
             className="bg-[#1a1a1a] rounded p-2 shadow hover:shadow-lg relative cursor-pointer"
            >
              {/* Tombol tambah koleksi di pojok kanan atas poster */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah klik bubble ke parent
                  handleAddToCollection(film);
                }}
                className="absolute top-2 right-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full w-7 h-7 flex items-center justify-center font-bold text-lg shadow-md"
                title="Tambah ke Koleksi"
              >
                +
              </button>

              {film.Poster !== 'N/A' ? (
                <img
                  src={film.Poster}
                  alt={film.Title}
                  className="w-full h-[400px] object-cover rounded"
                />
              ) : (
                <CoverNotFoundLarge />
              )}
              <div className="mt-2 text-sm text-yellow-400 font-semibold">{film.Title}</div>
              <div className="text-xs text-gray-400">{film.Year}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer dengan tombol ke halaman koleksi */}
      <footer className="w-full p-6 bg-[#1a1a1a] text-center">
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => handleLogout()}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-semibold"
          >
            Logout
          </button>
          <button
            onClick={() => navigate('/koleksi')}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded font-semibold"
          >
            Kelola Koleksi Saya
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
