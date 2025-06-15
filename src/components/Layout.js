// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Import Navbar

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Page content will be rendered here */}
      </main>
      {/* You can add a Footer here if you want */}
    </div>
  );
}