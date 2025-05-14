import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFilms } from '../api/filmApi';
import { getStatuses } from '../api/statusApi'; // Tambahkan API untuk mengambil status

const FilmList = () => {
  const [films, setFilms] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mengambil film dan status dari API
    getFilms().then(res => setFilms(res.data));
    getStatuses().then(res => setStatuses(res.data));
  }, []);

  // Menyaring film berdasarkan status
  const filteredFilms = films
    .filter(film => {
      // Filter berdasarkan status
      if (filter !== 'All' && film.status && film.status.nama !== filter) {
        return false;
      }

      // Filter berdasarkan judul film
      if (search && !film.judul.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      return true;
    });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Daftar Film</h1>
      <Link to="/add" className="bg-blue-500 text-white px-4 py-2 rounded">Tambah Film</Link>

      <div className="mt-4 mb-2">
        <label className="mr-2">Filter Status: </label>
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
          value={filter}
        >
          <option value="All">Semua</option>
          {statuses.map(status => (
            <option key={status.id} value={status.nama}>
              {status.nama}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 mb-2">
        <label className="mr-2">Cari Film: </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan judul"
          className="border p-2 rounded"
        />
      </div>

      <ul className="mt-4 space-y-2">
        {filteredFilms.map(film => (
          <li key={film.id} className="border p-2 rounded shadow">
            <Link to={`/film/${film.id}`} className="text-lg font-semibold">{film.judul}</Link>
            <div className="flex gap-2 mt-2">
              <Link to={`/edit/${film.id}`} className="text-blue-600">Edit</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilmList;
