import React, { useState, useEffect } from 'react';
import { getFilms } from '../api/filmApi';
import { getStatuses } from '../api/statusApi'; // API untuk mengambil status
import { updateFilm } from '../api/filmApi';

const StatusManager = () => {
  const [films, setFilms] = useState([]);
  const [statuses, setStatuses] = useState([]); // Menyimpan daftar status

  useEffect(() => {
    // Mengambil data film dan status dari API
    getFilms().then(res => setFilms(res.data));
    getStatuses().then(res => setStatuses(res.data));
  }, []);

  // Mengubah status film
  const handleStatusChange = async (id, newStatusId) => {
    await updateFilm(id, { status_id: newStatusId }); // Kirim ID status, bukan nama status
    setFilms(films.map(film => 
      film.id === id ? { ...film, status_id: newStatusId } : film)); // Update status di UI
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kelola Status Tonton</h1>
      <ul>
        {films.map(film => (
          <li key={film.id} className="border p-2 rounded shadow mb-2">
            <div className="flex justify-between items-center">
              <h3>{film.judul}</h3>
              <div>
                {statuses.map(status => (
                  <button
                    key={status.id}
                    onClick={() => handleStatusChange(film.id, status.id)}
                    className={`px-2 py-1 rounded ${
                      film.status_id === status.id ? 
                      'bg-green-500' : 'bg-gray-500'
                    }`}
                  >
                    {status.nama}
                  </button>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusManager;
