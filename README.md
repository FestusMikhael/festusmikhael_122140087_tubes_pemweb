# Aplikasi Web Manajemen Film Pribadi

## Deskripsi
Aplikasi web ini memungkinkan pengguna untuk mengelola daftar film pribadi mereka. Pengguna dapat menyimpan film yang telah ditonton atau ingin ditonton, memberikan ulasan, menilai film, dan mencatat tanggal menonton. Aplikasi ini juga menyediakan rekomendasi film terbaru dari OMDb API.

## Dependensi
### Backend (Pyramid + PostgreSQL)
- Python 3.x
- Pyramid
- SQLAlchemy
- Alembic
- psycopg2
- Pydantic
- Requests

### Frontend (React + Vite)
- React
- Vite
- Axios
- Tailwind CSS
- React Router DOM
- ContextAPI

## Fitur Aplikasi
### CRUD Entitas:
- **User**: registrasi, login, update profil, hapus akun
- **Film**: tambah, lihat detail, update status tonton, hapus
- **Review**: tambah dan lihat review untuk setiap film
- **Status**: tambah, lihat, update status
  
### Fitur Lain:
- Autentikasi pengguna (login & register)
- Rekomendasi film dari OMDb API di halaman utama
- Pencarian film interaktif dari OMDb API
- Daftar film pribadi berdasarkan status (sudah ditonton / ingin ditonton)
- UI responsif dan ramah pengguna
  
## Referensi
- [Pyramid Web Framework](https://trypyramid.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [OMDb API](https://www.omdbapi.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
