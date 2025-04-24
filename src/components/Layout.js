// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // <<< Import Outlet
import Navbar from './Navbar'; // <<< Import Navbar ที่แยกออกมา

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* แสดง Navbar เสมอ */}
      <main className="flex-grow"> {/* เนื้อหาหลักของแต่ละหน้า */}
        <Outlet /> {/* <<< ส่วนนี้จะถูกแทนที่ด้วย Component ของ Route ที่ Match */}
      </main>
      {/* คุณสามารถเพิ่ม Footer ตรงนี้ได้ ถ้าต้องการ */}
      {/* <Footer /> */}
    </div>
  );
}