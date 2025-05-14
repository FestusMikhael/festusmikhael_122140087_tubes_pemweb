import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFilm } from '../api/filmApi'; // Hanya import getFilm saja
import { addReview } from '../api/reviewApi'; // Import API untuk menambahkan review

const FilmDetail = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  // Mengambil data film berdasarkan id
  useEffect(() => {
    getFilm(id).then((res) => setFilm(res.data));
  }, [id]);

  // Menangani pengiriman review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Membuat objek review baru
    const newReview = { komentar: review, rating: rating, film_id: id };

    // Mengirimkan review ke API
    await addReview(newReview);

    // Setelah review ditambahkan, perbarui data film untuk menampilkan review yang baru
    setFilm((prevFilm) => ({
      ...prevFilm,
      reviews: [...prevFilm.reviews, newReview],
    }));

    // Reset form input review
    setReview('');
    setRating(0);
  };

  if (!film) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{film.judul}</h1>
      <p>
        <strong>Sutradara:</strong> {film.sutradara}
      </p>
      <p>
        <strong>Genre:</strong> {film.genre}
      </p>
      <p>
        <strong>Tahun:</strong> {film.tahun}
      </p>

      {/* Form untuk menambahkan review */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Review</h2>
        <form onSubmit={handleReviewSubmit}>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-2 mt-2 border rounded"
            placeholder="Tulis komentar kamu..."
          />
          <div className="mt-2">
            <label>Rating: </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min="1"
              max="5"
              className="w-20 p-1 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Kirim Review
          </button>
        </form>
      </div>

      {/* Menampilkan review yang ada */}
      <div className="mt-4">
        <h3 className="font-semibold">Komentar:</h3>
        {film.reviews && film.reviews.length > 0 ? (
          film.reviews.map((review, index) => (
            <div key={index} className="mb-2">
              <p><strong>Rating:</strong> {review.rating}/5</p>
              <p>{review.komentar}</p>
            </div>
          ))
        ) : (
          <p>Tidak ada komentar.</p>
        )}
      </div>
    </div>
  );
};

export default FilmDetail;
