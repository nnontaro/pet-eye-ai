// src/pages/HomePage.js (แก้ไขแล้ว - ลบ Navbar ที่ซ้ำซ้อนออก)

import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import dogCatImage from '../images/cat-dog.png';

// --- AnalyzerSection ---
function AnalyzerSection() {
  const navigate = useNavigate();

  const handlePetTypeSelect = (petType) => {
    console.log("Selected pet type:", petType);
    const encodedPetType = encodeURIComponent(petType);
    navigate(`/upload/${encodedPetType}`);
  };

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
  const analyzerRef = useRef(null);
  
  const handleScrollToAnalyzer = () => {
    analyzerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ***** ไม่ต้องมีฟังก์ชัน Navbar ที่นี่แล้ว *****

  return (
    // ***** ไม่ต้องมี <div className="min-h-screen flex flex-col"> แล้ว เพราะ Layout.js จัดการให้ *****
    <>
      {/* ***** ไม่ต้องเรียก <Navbar /> ที่นี่แล้ว เพราะ Layout.js จัดการให้ ***** */}
      
      {/* --- Hero Section --- */}
      <div
        className="flex flex-col items-center justify-center bg-cover bg-center relative text-white"
        style={{ backgroundImage: `url(${backgroundImageUrl})`, minHeight: 'calc(100vh - 72px)' }} // 72px คือความสูงของ Navbar โดยประมาณ (p-4 = 1rem*2 + text height)
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full px-4 py-10 md:py-16">
          <div className="bg-black bg-opacity-55 py-4 px-6 md:py-8 md:px-8 rounded-2xl shadow-lg mb-5">
            <h1 className="text-4xl md:text-5xl font-bold text-white"> PetCare EyeSense </h1>
          </div>
          <p className="text-lg text-gray-100 mb-8 max-w-xl">
          แพลตฟอร์มวิเคราะห์โรคตาในสุนัขและแมวด้วยเทคโนโลยีปัญญาประดิษฐ์
          </p>
          <div className="flex gap-4 flex-col sm:flex-row justify-center w-full max-w-md">
            <button
              onClick={handleScrollToAnalyzer}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition text-base font-semibold"
            >
              เริ่มวิเคราะห์
            </button>
          </div>
        </div>
      </div>

      {/* --- Analyzer Section Container --- */}
      <div ref={analyzerRef} className="w-full">
          <AnalyzerSection />
      </div>
    </>
 );
}