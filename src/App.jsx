import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditFilm from './pages/EditFilm';
import FilmDetail from './pages/FilmDetail';
import StatusManager from './pages/StatusManager';
import SearchFilm from './pages/SearchFilm';
import Register from './pages/Register';  // Import Register
import Login from './pages/Login';        // Import Login

const App = () => (
  <Router>
    <div className="p-4">
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/edit/:id" element={<EditFilm />} />
        <Route path="/film/:id" element={<FilmDetail />} />
        <Route path="/status" element={<StatusManager />} />
        <Route path="/search" element={<SearchFilm />} />
      </Routes>
    </div>
  </Router>
);

export default App;
