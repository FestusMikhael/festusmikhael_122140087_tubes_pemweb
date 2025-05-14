import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFilm, updateFilm } from '../api/filmApi';

const EditFilm = () => {
  const [form, setForm] = useState({ judul: '', tahun: '', sutradara: '', genre: '', status_id: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  // Mengambil data film berdasarkan ID
  useEffect(() => {
    getFilm(id)
      .then(res => {
        setForm(res.data);
      })
      .catch(err => {
        console.error('Error fetching film:', err);
        navigate('/');
      });
  }, [id, navigate]);

  // Meng-handle perubahan input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Meng-handle pengiriman form untuk memperbarui data film
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateFilm(id, form);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-bold">Edit Film</h1>
      
      {['judul', 'tahun', 'sutradara', 'genre'].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={field}
          value={form[field]}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      ))}

      {/* Dropdown untuk memilih status film */}
      <select
        name="status_id"
        value={form.status_id}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Pilih Status</option>
        {/* Misalnya, status bisa seperti ini: */}
        <option value="1">Belum Ditonton</option>
        <option value="2">Sedang Ditonton</option>
        <option value="3">Selesai Ditonton</option>
      </select>

      {/* Tombol untuk menyimpan perubahan */}
      <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
    </form>
  );
};

export default EditFilm;
