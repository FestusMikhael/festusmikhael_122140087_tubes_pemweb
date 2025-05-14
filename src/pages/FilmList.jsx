import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFilms } from '../api/filmApi';
import { getStatuses } from '../api/statusApi';
import { searchFilmOMDb } from '../api/omdbApi';

const FilmList = () => {
  const [films, setFilms] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [externalResults, setExternalResults] = useState([]);

  useEffect(() => {
    // Ambil film pribadi & status saat pertama kali render
    getFilms().then(res => setFilms(res.data));
    getStatuses().then(res => setStatuses(res.data));
  }, []);

  // Panggil OMDb saat user mengetik query
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() !== '') {
        searchFilmOMDb(search).then(setExternalResults);
      } else {
        setExternalResults([]);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const filteredFilms = filter === 'All'
    ? films
    : films.filter(f => f.status?.nama === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Daftar Film</h1>
      <Link to="/add" className="bg-blue-500 text-white px-4 py-2 rounded">Tambah Film</Link>

      <div className="mt-4 mb-4 flex flex-col gap-4 md:flex-row md:items-center">
        <div>
          <label className="mr-2">Filter Status: </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="All">Semua</option>
            {statuses.map(status => (
              <option key={status.id} value={status.nama}>{status.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Cari film dari OMDb..."
            className="border p-2 rounded w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Film Pribadi */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Film Pribadi</h2>
      {filteredFilms.length > 0 ? (
        <ul className="space-y-2">
          {filteredFilms.map(film => (
            <li key={film.id} className="border p-2 rounded shadow">
              <Link to={`/film/${film.id}`} className="text-lg font-semibold">{film.judul}</Link>
              <div className="text-sm text-gray-600">Status: {film.status?.nama || '-'}</div>
              <div className="mt-2">
                <Link to={`/edit/${film.id}`} className="text-blue-600">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Belum ada film pribadi yang cocok.</p>
      )}

      {/* Hasil dari OMDb */}
      {externalResults.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">Hasil Pencarian dari OMDb</h2>
          <ul className="space-y-2">
            {externalResults.map(film => (
              <li key={film.imdbID} className="border p-2 rounded shadow flex items-center gap-4">
                {film.Poster !== 'N/A' && (
                  <img src={film.Poster} alt={film.Title} className="w-16 h-auto" />
                )}
                <div>
                  <div className="font-semibold">{film.Title} ({film.Year})</div>
                  <div className="text-sm text-gray-500">IMDb ID: {film.imdbID}</div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default FilmList;
