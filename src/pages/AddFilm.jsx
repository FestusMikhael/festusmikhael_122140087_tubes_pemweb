import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFilm } from '../api/filmApi';

const AddFilm = () => {
  // State untuk menyimpan data form
  const [form, setForm] = useState({ judul: '', tahun: '', sutradara: '', genre: '', status_id: '' });
  const navigate = useNavigate();

  // Meng-handle perubahan input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Meng-handle pengiriman form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Menambahkan film menggunakan API
    await addFilm(form);

    // Setelah berhasil menambah film, arahkan kembali ke halaman utama
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-bold">Tambah Film</h1>
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
      
      {/* Input untuk memilih status film */}
      <select
        name="status_id"
        value={form.status_id}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Pilih Status</option>
        {/* Pilih status film, misalnya: */}
        <option value="1">Belum Ditonton</option>
        <option value="2">Sedang Ditonton</option>
        <option value="3">Selesai Ditonton</option>
      </select>

      {/* Tombol submit untuk menyimpan film */}
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Simpan</button>
    </form>
  );
};

export default AddFilm;
