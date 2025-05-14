# Aplikasi Web Manajemen Film Pribadi dengan Fitur Review dan Status Tonton

## Deskripsi Aplikasi Web
Aplikasi web yang membantu pengguna dalam mengelola daftar film pribadi. Pengguna dapat menambahkan film dari sumber eksternal (OMDb API), memberi status seperti "Ingin Ditonton", "Sedang Ditonton", atau "Selesai Ditonton", serta menulis ulasan (review) untuk setiap film. Aplikasi ini dibangun dengan arsitektur **Frontend-Backend terpisah**, menggunakan React JS di sisi frontend dan Pyramid (Python) sebagai backend dengan PostgreSQL sebagai basis data.

## Dependensi Paket (Library) yang Dibutuhkan

### Backend (Pyramid & Python)
- `pyramid`
- `pyramid_jinja2`
- `sqlalchemy`
- `psycopg2` (untuk koneksi PostgreSQL)
- `zope.sqlalchemy`
- `pydantic` (untuk validasi data)
- `alembic` (untuk migrasi database)

### Frontend (React)
- `react`
- `react-router-dom`
- `axios`
- `tailwindcss`
- `vite` (sebagai bundler)

## Fitur pada Aplikasi

1. **CRUD Film Pribadi**  
   - Tambah, edit, dan hapus film secara manual atau dari OMDb API.

2. **Integrasi dengan OMDb API**  
   - Cari film berdasarkan judul melalui API eksternal.

3. **Manajemen Status Film**  
   - Tambahkan dan kelola status film: Ingin Ditonton, Sedang Ditonton, atau Selesai Ditonton.

4. **Review Film**  
   - Tulis dan kelola ulasan film pribadi.

5. **Filter Film Berdasarkan Status**  
   - Filter daftar film berdasarkan status yang dipilih.

6. **UI/UX Modern**  
   - Tampilan responsif menggunakan Tailwind CSS.

## Referensi

- [Pyramid Documentation](https://docs.pylonsproject.org/projects/pyramid/en/latest/)
- [React Documentation](https://reactjs.org/)
- [OMDb API](https://www.omdbapi.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
