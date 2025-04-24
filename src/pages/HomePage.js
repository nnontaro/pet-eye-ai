// src/pages/HomePage.js
import React, { useRef } from 'react';
import { Link, useNavigate } from "react-router-dom"; // ยังคงต้องใช้ useNavigate ใน AnalyzerSection
import { useAuth0 } from '@auth0/auth0-react'; // ต้องใช้ใน Navbar
import {
  HomeIcon,
  UserCircleIcon,
  InformationCircleIcon,
  ClockIcon,
  PhoneIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'; // Icons สำหรับ Navbar
import dogCatImage from '../images/cat-dog.png'; // รูปสำหรับ AnalyzerSection

// --- AnalyzerSection ---
// (กำหนดไว้ใน HomePage หรือจะ Import มาก็ได้ถ้าแยกไฟล์ส่วนนี้ไปแล้ว)
function AnalyzerSection() {
  const navigate = useNavigate();

  const handlePetTypeSelect = (petType) => {
    console.log("Selected pet type:", petType);
    const encodedPetType = encodeURIComponent(petType);
    navigate(`/upload/${encodedPetType}`);
  };

   // ใช้ JSX ล่าสุดของ AnalyzerSection ที่คุณให้มา (มี Absolute Position)
   // แต่แก้ไข Overlay และ z-index ให้ถูกต้อง
   return (
    <div
        className="w-full rounded-lg overflow-hidden relative bg-cover bg-center shadow-xl"
        style={{ backgroundImage: `url(${dogCatImage})`, minHeight: '800px' }}
    >
        <div className="absolute inset-0 bg-white bg-opacity-0"></div>
        <div className="relative z-10 p-6 md:p-10 flex flex-col items-start min-h-[inherit] h-full">
            <h2 className="text-3xl md:text-4xl font-prompt font-bold text-gray-800 mb-2 uppercase">
                ABOUT OUR PROJECT
            </h2>
            <p className="text-gray-600 text-sm mb-6 uppercase">
                PLEASE CHOOSE YOUR TYPE OF VET
            </p>
            <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-10 z-20">
                <button
                    onClick={() => handlePetTypeSelect('สุนัข')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition transform hover:scale-105"
                >
                    DOG EYES
                </button>
                <button
                    onClick={() => handlePetTypeSelect('แมว')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition transform hover:scale-105"
                >
                    CAT EYES
                </button>
            </div>
            <div className="text-gray-700 text-sm space-y-1 text-left max-w-xl mt-6">
                <p>bra bra bra bra bra</p>
                <p>bra bra bra brabra bra bra brabra bra bra</p>
            </div>
        </div>
    </div>
   );
} // --- End AnalyzerSection ---

// --- HomePage Component ---
export default function HomePage() {
  const backgroundImageUrl = 'https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=12%2C96%2C2671%2C1335&q=45&auto=format&w=1356&h=668&fit=crop';
  // --- Ref และ Handler กลับมาอยู่ที่นี่ ---
  const analyzerRef = useRef(null);
  const handleScrollToAnalyzer = () => {
    analyzerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  // -------------------------------------

  // --- Navbar กลับมาอยู่ใน HomePage ---
  function Navbar() {
    const {
        loginWithRedirect,
        logout,
        user,
        isAuthenticated,
        isLoading
    } = useAuth0();

    const scrollToTop = (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="bg-gray-900 text-gray-200 p-3 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2">
              <div className="bg-yellow-400 p-2 rounded-md"><span className="font-bold text-black text-lg">B</span></div>
              <span className="text-sm font-semibold hidden sm:inline">PUPPY EYE CHECK</span>
            </Link>
            <div className="flex items-center space-x-3 md:space-x-5">
               <button onClick={scrollToTop} className="hover:text-white flex items-center space-x-1 cursor-pointer">
                <HomeIcon className="h-4 w-4" /><span className="hidden md:inline text-sm">หน้าหลัก</span>
              </button>
              {/* ปุ่ม "เกี่ยวกับ" กลับมาใช้ handleScrollToAnalyzer ที่อยู่ใน HomePage */}
              <button
                  onClick={handleScrollToAnalyzer}
                  className="hover:text-white flex items-center space-x-1 cursor-pointer"
              >
                  <InformationCircleIcon className="h-4 w-4" />
                  <span className="hidden md:inline text-sm">เกี่ยวกับ</span>
              </button>
              <Link to="/history" className="hover:text-white flex items-center space-x-1">
                 <ClockIcon className="h-4 w-4" /><span className="hidden md:inline text-sm">ประวัติ</span>
              </Link>
              <Link to="/contact" className="hover:text-white flex items-center space-x-1">
                <PhoneIcon className="h-4 w-4" /><span className="hidden md:inline text-sm">ติดต่อ</span>
              </Link>
              {/* Login/Logout Buttons */}
              {!isLoading && !isAuthenticated && (
                  <button onClick={() => loginWithRedirect()} className="hover:text-white flex items-center space-x-1">
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span className="hidden md:inline text-sm">เข้าสู่ระบบ / สมัคร</span>
                  </button>
              )}
              {!isLoading && isAuthenticated && (
                  <>
                      {user?.picture && (
                          <img src={user.picture} alt={user?.name} className="h-6 w-6 rounded-full" />
                      )}
                      <span className='text-sm hidden lg:inline'>{user?.name || user?.email}</span>
                      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="hover:text-white flex items-center space-x-1">
                          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                          <span className="hidden md:inline text-sm">ออกจากระบบ</span>
                      </button>
                  </>
              )}
            </div>
          </div>
        </nav>
      );
  } // --- End Navbar ---

  // --- โครงสร้าง return ของ HomePage กลับมาเหมือนตอนแรกๆ ---
  return (
    <div className="min-h-screen flex flex-col"> {/* ใช้ div ครอบเหมือนเดิม */}
      <Navbar /> {/* เรียก Navbar ที่ define ไว้ข้างบน */}
      {/* --- Hero Section --- */}
      <div
        className="flex-grow flex flex-col items-center justify-center bg-cover bg-center relative text-white" // อาจจะเพิ่ม flex-grow กลับมา
        style={{ backgroundImage: `url(${backgroundImageUrl})`, minHeight: 'calc(100vh - 60px)' }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full px-4 py-10 md:py-16">
          <div className="bg-black bg-opacity-55 py-4 px-6 md:py-8 md:px-8 rounded-2xl shadow-lg mb-5">
            <h1 className="text-4xl md:text-5xl font-bold text-white"> PetEye AI</h1>
          </div>
          <p className="text-lg text-gray-100 mb-8 max-w-xl">
            แพลตฟอร์มช่วยตรวจสอบโรคตาในสุนัขและแมว ด้วย AI และข้อมูลอาการร่วม
          </p>
          <div className="flex gap-4 flex-col sm:flex-row justify-center w-full max-w-md">
            <button
              onClick={handleScrollToAnalyzer} // <<< ปุ่มนี้เรียก Handler ที่อยู่ใน HomePage
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition text-base font-semibold"
            >
              เริ่มวิเคราะห์
            </button>
          </div>
        </div>
      </div>

      {/* --- Analyzer Section Container --- */}
      <div ref={analyzerRef} className="w-full"> {/* <<< ผูก Ref ที่อยู่ใน HomePage */}
          <AnalyzerSection />
      </div>
    </div>
 );
} // --- End HomePage ---