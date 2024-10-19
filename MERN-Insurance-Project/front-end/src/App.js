import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import AddUpload from './pages/Uploadadd';
import Verify from './pages/Verify';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="login" element={<Login />} />
            <Route path="/register" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload-additional" element={<AddUpload />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
