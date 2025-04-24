// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';

function App() {
  return (
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload/:petType" element={<UploadPage />} />
          {/* Other routes */}
          <Route path="/history" element={<div>History Page Placeholder</div>} />
          <Route path="/contact" element={<div>Contact Page Placeholder</div>} />
          <Route path="/about" element={<div>About Page Placeholder</div>} />
      </Routes>
  );
}
export default App;