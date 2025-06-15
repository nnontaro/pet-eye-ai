// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    // ***** ไม่ต้องมี <Router> ที่นี่ *****
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="upload/:petType" element={<UploadPage />} />
        <Route path="result" element={<ResultPage />} />
        <Route path="history" element={<HistoryPage />} />
        {/* สามารถเพิ่ม Route อื่นๆ ที่ต้องการให้มี Navbar ที่นี่ได้ */}
      </Route>
    </Routes>
  );
}

export default App;