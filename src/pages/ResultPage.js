// src/pages/ResultPage.js (แก้ไขแล้ว)

import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, HomeIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // VVVV จุดที่แก้ไข VVVV
    // เราจะใช้ชื่อ "resultData" ให้ตรงกับตอนที่ส่งมาจาก UploadPage
    const resultData = location.state?.resultData;

    // หากไม่มีข้อมูล resultData (เช่น เข้ามาที่ /result ตรงๆ) ให้ redirect กลับไปหน้าหลัก
    useEffect(() => {
        if (!resultData) {
            console.warn("No result data found in location state. Redirecting to home.");
            navigate('/');
        }
    }, [resultData, navigate]);

    // ถ้ายังไม่มีข้อมูล ให้แสดง Loading หรือ null ไปก่อน
    if (!resultData) {
        return <div className="text-center p-20">กำลังโหลดข้อมูลผลลัพธ์...</div>;
    }

    const getConfidenceColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'high': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-orange-600 bg-orange-100';
            case 'very low': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const {
        likely_diagnosis = "N/A",
        confidence_level = "N/A",
        key_symptoms_found = [],
        recommendations = [],
        warnings = [],
        disclaimer = "ผลการวิเคราะห์นี้เป็นเพียงข้อมูลเบื้องต้น"
    } = resultData;

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <div className="flex items-center mb-6">
                 <button onClick={() => navigate(-1)} className="text-indigo-600 hover:text-indigo-800 flex items-center mr-4">
                     <ArrowLeftIcon className="h-5 w-5 mr-1" /> กลับ
                 </button>
                <h1 className="text-3xl font-bold">ผลการวิเคราะห์เบื้องต้น</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">

                <div className="mb-6 pb-4 border-b">
                    <h2 className="text-xl font-semibold mb-2">ผลการวินิจฉัยที่เป็นไปได้มากที่สุด:</h2>
                    <p className="text-2xl font-bold text-indigo-700 mb-2">{likely_diagnosis}</p>
                    <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">ระดับความมั่นใจ:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(confidence_level)}`}>
                            {confidence_level}
                        </span>
                    </div>
                </div>

                {key_symptoms_found.length > 0 && (
                     <div className="mb-6 pb-4 border-b">
                         <h3 className="text-lg font-semibold mb-2 flex items-center">
                             <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-500"/> อาการสำคัญที่ระบุ:
                         </h3>
                         <ul className="list-disc list-inside text-gray-700 space-y-1">
                             {key_symptoms_found.map((symptomKey, index) => (
                                 <li key={index}>{symptomKey.replace(/_/g, ' ').replace(/behavior |eye direct |eye around |systemic /g, (match) => `${match.charAt(0).toUpperCase()}${match.slice(1)}`)}</li>
                             ))}
                         </ul>
                     </div>
                 )}

                {warnings.length > 0 && (
                    <div className="mb-6 pb-4 border-b border-red-300 bg-red-50 p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2 flex items-center text-red-700">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2"/> คำเตือนเร่งด่วน!
                        </h3>
                        <ul className="list-disc list-inside text-red-800 space-y-1">
                            {warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {recommendations.length > 0 && (
                    <div className="mb-6 pb-4">
                        <h3 className="text-lg font-semibold mb-2 flex items-center text-green-700">
                            <CheckCircleIcon className="h-5 w-5 mr-2"/> คำแนะนำ:
                        </h3>
                        <ul className="list-disc list-inside text-gray-800 space-y-1">
                            {recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-6 p-4 bg-gray-100 rounded-md text-sm text-gray-600">
                    <p><strong>ข้อจำกัดความรับผิดชอบ:</strong> {disclaimer}</p>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                        <HomeIcon className="h-5 w-5 mr-2" /> กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    );
}