import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async e => {
  e.preventDefault();
  setMessage('');

  try {
    const response = await login(form); // Misal response: { token, message, error }
    
    if (response.error) {
      // Kalau ada error dari server, tampilkan pesan dan jangan redirect
      setMessage(response.error);
    } else {
      // Login sukses, simpan token dan redirect
      localStorage.setItem('token', response.token);
      navigate('/home');
    }
  } catch (error) {
    setMessage(error.message || 'Login gagal');
  }
};


  return (
    <main className="w-full max-w-xl min-w-[350px] min-h-[450px] mx-auto p-8 bg-gray-900 rounded-2xl shadow-2xl mt-16">
      <h1 className="text-2xl font-semibold text-yellow-300 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 relative">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="p-3 rounded-xl bg-gray-800 border border-yellow-400 text-yellow-200 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="p-3 rounded-xl bg-gray-800 border border-yellow-400 text-yellow-200 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-yellow-400 hover:text-yellow-300 focus:outline-none"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.97 9.97 0 012.293-6.115M15 15l3 3m-9-9l3 3m6 0l3 3m-6-6L9 9" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 rounded-xl transition"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-yellow-400">{message}</p>}
      <p className="mt-6 text-center text-yellow-300">
        Belum punya akun?{' '}
        <Link to="/" className="underline hover:text-yellow-500 font-semibold">
          Daftar
        </Link>
      </p>
    </main>
  );
}
