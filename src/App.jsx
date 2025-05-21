import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';  // import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Collection from './pages/Collection';

const App = () => (
  <Router>
    <div className="p-4">
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/koleksi" element={<Collection />} />
      </Routes>
      <ToastContainer />
    </div>
  </Router>
);

export default App;
