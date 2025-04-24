// src/pages/UploadPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; // <<< Import useAuth0
import { // <<< Import Icons
  HomeIcon, InformationCircleIcon, ClockIcon, PhoneIcon,
  ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function UploadPage() {
    const { petType } = useParams();
    const navigate = useNavigate();

    // --- 1. เปลี่ยนชื่อ isLoading จาก useAuth0 เป็น isAuthLoading ---
    const {
        loginWithRedirect, logout, user, isAuthenticated,
        isLoading: isAuthLoading // <<< เปลี่ยนชื่อตรงนี้
    } = useAuth0();
    // -------------------------------------------------------

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // --- 2. ใช้ isLoading, setIsLoading สำหรับ State การวิเคราะห์ตามปกติ ---
    const [isLoading, setIsLoading] = useState(false);
    // ------------------------------------------------------------
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!selectedFile) { setPreview(undefined); return; }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFileChange = (event) => {
        if (!event.target.files || event.target.files.length === 0) { setSelectedFile(null); return; }
        setSelectedFile(event.target.files[0]);
        setResult(null);
    };

    const handleUploadAndAnalyze = async () => {
        if (!selectedFile) { alert("กรุณาเลือกไฟล์รูปภาพก่อน"); return; }
        // --- 3. ใช้ setIsLoading สำหรับการวิเคราะห์ ---
        setIsLoading(true);
        // --------------------------------------
        setResult(null);
        console.log("Uploading...", selectedFile.name, petType);
        // --- Mock API call ---
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockResult = { disease: Math.random() > 0.5 ? 'ต้อกระจก (จำลอง)' : 'ตาแดง (จำลอง)', confidence: Math.random().toFixed(2), recommendation: 'ควรปรึกษาสัตวแพทย์ (จำลอง)' };
        setResult(mockResult);
        // --- 3. ใช้ setIsLoading สำหรับการวิเคราะห์ ---
        setIsLoading(false);
        // --------------------------------------
    };

    const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleAboutClick = () => { navigate('/', { state: { scrollToAnalyzer: true }, replace: true }); };
    const handleHomeClick = (event) => { event.preventDefault(); scrollToTop(); navigate('/'); };

    return (
        <div>
            {/* === Navbar === */}
            <nav className="bg-gray-900 text-gray-200 p-3 shadow-lg sticky top-0 z-50">
              <div className="container mx-auto flex justify-between items-center">
                <Link to="/" onClick={handleHomeClick} className="flex items-center space-x-2">
                  <div className="bg-yellow-400 p-2 rounded-md"><span className="font-bold text-black text-lg">B</span></div>
                  <span className="text-sm font-semibold hidden sm:inline">PUPPY EYE CHECK</span>
                </Link>
                <div className="flex items-center space-x-3 md:space-x-5">
                   <button onClick={handleHomeClick} className="hover:text-white flex items-center space-x-1 cursor-pointer">
                    <HomeIcon className="h-4 w-4" /><span className="hidden md:inline text-sm">หน้าหลัก</span>
                  </button>
                  <button onClick={handleAboutClick} className="hover:text-white flex items-center space-x-1 cursor-pointer">
                      <InformationCircleIcon className="h-4 w-4" />
                      <span className="hidden md:inline text-sm">เกี่ยวกับ</span>
                  </button>
                  <Link to="/history" className="hover:text-white flex items-center space-x-1">
                     <ClockIcon className="h-4 w-4" /><span className="hidden md:inline text-sm">ประวัติ</span>
                  </Link>
                  <Link to="/contact" className="hover:text-white flex items-center space-x-1">
                    <PhoneIcon className="h-4 w-4" /><span className="hidden md:inline text-sm">ติดต่อ</span>
                  </Link>
                  {/* --- 4. ใช้ isAuthLoading ในเงื่อนไข Navbar --- */}
                  {!isAuthLoading && !isAuthenticated && (
                      <button onClick={() => loginWithRedirect()} className="hover:text-white flex items-center space-x-1">
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span className="hidden md:inline text-sm">เข้าสู่ระบบ / สมัคร</span>
                      </button>
                  )}
                  {!isAuthLoading && isAuthenticated && (
                      <>
                          {user?.picture && ( <img src={user.picture} alt={user?.name} className="h-6 w-6 rounded-full" /> )}
                          <span className='text-sm hidden lg:inline'>{user?.name || user?.email}</span>
                          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="hover:text-white flex items-center space-x-1">
                              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                              <span className="hidden md:inline text-sm">ออกจากระบบ</span>
                          </button>
                      </>
                  )}
                  {/* ------------------------------------- */}
                </div>
              </div>
            </nav>
            {/* ====================================== */}

            <div className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-4 mt-4">วิเคราะห์ภาพถ่ายดวงตา{petType === 'สุนัข' ? 'สุนัข' : 'แมว'}</h1>
                <p className="mb-6 text-gray-600">กรุณาอัปโหลดภาพถ่ายดวงตาของ{petType === 'สุนัข' ? 'สุนัข' : 'แมว'}ที่ชัดเจน</p>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                   <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">เลือกรูปภาพ:</label>
                    <input id="file-upload" name="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                    {preview && ( <div className="mt-4 border rounded-md p-2 inline-block"> <p className="text-sm text-gray-500 mb-1">รูปที่เลือก:</p> <img src={preview} alt="Preview" className="max-w-xs max-h-48 object-contain rounded"/> </div> )}
                </div>
                {/* --- 5. ใช้ isLoading สำหรับปุ่มและผลวิเคราะห์ --- */}
                <button
                    onClick={handleUploadAndAnalyze}
                    disabled={!selectedFile || isLoading}
                    className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white shadow-md transition ${!selectedFile || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isLoading ? 'กำลังวิเคราะห์...' : 'เริ่มการวิเคราะห์'}
                </button>
                {result && !isLoading && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
                       <h2 className="text-xl font-semibold mb-3">ผลการวิเคราะห์ (จำลอง):</h2>
                       {result.error ? (<p className="text-red-600">{result.error}</p>) : (
                           <ul className="space-y-1 list-disc list-inside">
                               <li><strong>ผลวินิจฉัยเบื้องต้น:</strong> {result.disease}</li>
                               <li><strong>ระดับความมั่นใจ:</strong> {result.confidence}</li>
                               <li><strong>คำแนะนำ:</strong> {result.recommendation}</li>
                           </ul>
                       )}
                    </div>
                )}
                {/* ------------------------------------------ */}
            </div>
        </div>
    );
}