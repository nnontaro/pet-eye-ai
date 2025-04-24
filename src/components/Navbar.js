// src/components/Navbar.js
import React from 'react';
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import {
  HomeIcon, UserCircleIcon, InformationCircleIcon, ClockIcon, PhoneIcon,
  ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

// --- รับ Prop onAboutClick ---
export default function Navbar({ onAboutClick }) {
    const { /* ... auth0 state ... */ } = useAuth0();
    const scrollToTop = (event) => { /* ... */ };

    return (
        <nav className="bg-gray-900 text-gray-200 p-3 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo */}
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2">
               {/* ... */}
            </Link>
            {/* Links */}
            <div className="flex items-center space-x-3 md:space-x-5">
               <button onClick={scrollToTop} className="hover:text-white flex items-center space-x-1 cursor-pointer">
                <HomeIcon className="h-4 w-4" /><span className="hidden md:inline text-sm">หน้าหลัก</span>
              </button>

              {/* --- ปุ่ม "เกี่ยวกับ" ใช้ Button และเรียก Prop --- */}
              <button
                  onClick={onAboutClick} // <<< เรียกใช้ Prop ที่ส่งมาจาก Layout
                  className="hover:text-white flex items-center space-x-1 cursor-pointer"
              >
                  <InformationCircleIcon className="h-4 w-4" />
                  <span className="hidden md:inline text-sm">เกี่ยวกับ</span>
              </button>
              {/* -------------------------------------------- */}

              <Link to="/history" className="hover:text-white flex items-center space-x-1">
                 <ClockIcon className="h-4 w-4" /><span className="hidden md:inline text-sm">ประวัติ</span>
              </Link>
              <Link to="/contact" className="hover:text-white flex items-center space-x-1">
                <PhoneIcon className="h-4 w-4" /><span className="hidden md:inline text-sm">ติดต่อ</span>
              </Link>
              {/* ... Login/Logout Buttons ... */}
            </div>
          </div>
        </nav>
      );
}