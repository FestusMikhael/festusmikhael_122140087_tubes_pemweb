import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Collection = () => {
  const [films, setFilms] = useState([]);
  const [reviews, setReviews] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ambil data film dan review
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token tidak ditemukan, silakan login ulang.');
      setLoading(false);
      return;
    }

    try {
      // Ambil film
      const filmsRes = await axios.get('http://localhost:6543/api/films', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const filmsData = filmsRes.data?.films || filmsRes.data || [];
      setFilms(filmsData);

      // Ambil review untuk setiap film
      const reviewsMap = {};
      await Promise.all(filmsData.map(async (film) => {
        try {
          const reviewRes = await axios.get(`http://localhost:6543/api/films/${film.id}/my-review`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          reviewsMap[film.id] = reviewRes.data.review;
        } catch (err) {
          // Jika tidak ada review, tidak perlu ditangani sebagai error
          if (err.response?.status !== 404) {
            console.error(`Gagal mengambil review untuk film ${film.id}:`, err);
          }
        }
      }));
      
      setReviews(reviewsMap);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
      setError('Gagal memuat koleksi film dan review.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    
    fetchData(); // Refresh list
  } catch (err) {
    console.error('Gagal menghapus film:', err);
    toast.error(err.response?.data?.error || 'Gagal menghapus film.');
  }
};

  // Handle submit review
  const handleReviewSubmit = async (filmId, reviewData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('Token tidak ditemukan, silakan login ulang.');
    return;
  }

  try {
    const url = `http://localhost:6543/api/films/${filmId}/my-review`;
    
    // Use PUT if review exists, POST if new
    const method = reviews[filmId] ? 'PUT' : 'POST';
    
    const res = await axios({
      method,
      url,
      data: reviewData,
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    setReviews(prev => ({ ...prev, [filmId]: res.data.review || res.data }));
    setEditingReview(null);
    toast.success(reviews[filmId] ? 'Review berhasil diperbarui!' : 'Review berhasil ditambahkan!');
  } catch (err) {
    console.error('Gagal menyimpan review:', err);
    if (err.response) {
      console.error('Response error:', err.response.data);
      toast.error(err.response.data.error || 'Gagal menyimpan review.');
    } else {
      toast.error('Gagal menyimpan review. Silakan coba lagi.');
    }
  }
};

  // Handle delete review
  const handleDeleteReview = async (reviewId, filmId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token tidak ditemukan, silakan login ulang.');
      return;
    }

    try {
      await axios.delete(`http://localhost:6543/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews(prev => {
        const newReviews = { ...prev };
        delete newReviews[filmId];
        return newReviews;
      });
      
      toast.success('Review berhasil dihapus!');
    } catch (err) {
      console.error('Gagal menghapus review:', err);
      toast.error(err.response?.data?.error || 'Gagal menghapus review.');
    }
  };

  // Render rating stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-400'}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">Koleksi Film Saya</h1>

      {loading && <p className="text-gray-400">Memuat koleksi...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && films.length === 0 && !error && (
        <p className="text-gray-400">Belum ada film di koleksi.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {films.map((film) =>(
          <div key={film.id} className="flex flex-col md:flex-row gap-6 bg-[#1a1a1a] rounded-lg p-4">
            {/* Film Section */}
            <div className="flex-shrink-0 w-full md:w-1/3">
              {film.poster ? (
                <img
                  src={film.poster}
                  alt={film.judul}
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                <div className="w-full h-64 bg-yellow-400 flex items-center justify-center text-black font-bold">
                  No Cover
                </div>
              )}

              <div className="mt-2 text-sm text-yellow-400 font-semibold">{film.judul}</div>
              <div className="text-xs text-gray-400">{film.tahun}</div>

              <button
                onClick={() => handleDelete(film.id, film.judul)}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-sm"
              >
                Hapus Film
              </button>
            </div>

            {/* Review Section */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-yellow-400">Review Saya</h3>
                {reviews[film.id] ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingReview(film.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(reviews[film.id].id, film.id)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingReview(film.id)}
                    className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1 text-sm"
                  >
                    Tambah Review
                  </button>
                )}
              </div>

              {editingReview === film.id ? (
                <div className="bg-[#2a2a2a] p-4 rounded">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    handleReviewSubmit(film.id, {
                      komentar: formData.get('komentar'),
                      rating: parseInt(formData.get('rating'))
                    });
                  }}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Rating</label>
                      <select
                        name="rating"
                        defaultValue={reviews[film.id]?.rating || 5}
                        className="bg-[#1a1a1a] text-white rounded px-3 py-2 w-full"
                        required
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Bintang</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Komentar</label>
                      <textarea
                        name="komentar"
                        defaultValue={reviews[film.id]?.komentar || ''}
                        className="bg-[#1a1a1a] text-white rounded px-3 py-2 w-full"
                        rows="3"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white rounded px-4 py-2"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingReview(null)}
                        className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              ) : reviews[film.id] ? (
                <div className="bg-[#2a2a2a] p-4 rounded">
                  <div className="mb-2">
                    <span className="font-semibold">Rating: </span>
                    {renderStars(reviews[film.id].rating)}
                  </div>
                  <div>
                    <span className="font-semibold">Komentar: </span>
                    <p className="text-gray-300">{reviews[film.id].komentar || '-'}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#2a2a2a] p-4 rounded text-gray-400">
                  Belum ada review untuk film ini.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;