// src/pages/HistoryPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import {
    ArrowLeftIcon, HomeIcon, ClockIcon, ServerIcon, ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';

function HistoryPage() {
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation(); // Added useLocation hook
    const navigate = useNavigate(); // Added useNavigate hook


    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = await getAccessTokenSilently();
                console.log("Auth0 Access Token obtained for /history");

                const apiUrl = 'http://localhost:8888/history'; // Ensure correct port

                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                     const errorText = await response.text();
                     throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const data = await response.json();
                console.log("History data received:", data);

                if (Array.isArray(data.history)) {
                     setHistoryData(data.history);
                } else {
                     console.error("Received data.history is not an array:", data);
                     setHistoryData([]);
                     setError("รูปแบบข้อมูลประวัติไม่ถูกต้อง");
                }

            } catch (err) {
                console.error("Error fetching history:", err);
                setError(err.message || "ไม่สามารถโหลดข้อมูลประวัติได้");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [getAccessTokenSilently]);

    const formatDate = (timestamp) => {
         if (!timestamp) return 'N/A';
         try {
             return new Date(timestamp).toLocaleString('th-TH', {
                 dateStyle: 'medium',
                 timeStyle: 'short'
             });
         } catch (e) {
             return timestamp;
         }
    };

    const getConfidenceColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'high': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-orange-600 bg-orange-100';
            case 'very low': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <div className="flex items-center mb-6">
                 <ClockIcon className="h-8 w-8 mr-3 text-indigo-600" />
                <h1 className="text-3xl font-bold">ประวัติการวิเคราะห์</h1>
            </div>

            {isLoading && (
                <div className="text-center py-10">
                    <ServerIcon className="h-12 w-12 mx-auto text-gray-400 animate-spin" />
                    <p className="mt-2 text-gray-500">กำลังโหลดข้อมูลประวัติ...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold mr-2">เกิดข้อผิดพลาด!</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {!isLoading && !error && historyData.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                     <InformationCircleIcon className="h-12 w-12 mx-auto text-gray-400"/>
                    <p className="mt-2 text-gray-500">ยังไม่มีข้อมูลประวัติการวิเคราะห์</p>
                    <Link to="/" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                         <HomeIcon className="h-5 w-5 mr-2" /> กลับหน้าหลัก
                     </Link>
                </div>
            )}

            {!isLoading && !error && historyData.length > 0 && (
                <div className="space-y-4">
                    {historyData.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-gray-500">
                                    {formatDate(item.analysis_timestamp)}
                                 </span>
                                 <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getConfidenceColor(item.confidence_level)}`}>
                                     {item.confidence_level || 'N/A'}
                                 </span>
                             </div>
                             <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.likely_diagnosis || 'ไม่ระบุ'}</h3>
                             <p className="text-sm text-gray-600 mb-2">ประเภท: {item.pet_type || 'N/A'}</p>
                        </div>
                    ))}
                </div>
            )}

             {!isLoading && !error && historyData.length > 0 && (
                 <div className="mt-8 text-center">
                     <Link to="/" className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                         <HomeIcon className="h-5 w-5 mr-2" /> กลับหน้าหลัก
                     </Link>
                 </div>
             )}
        </div>
    );
}

export default withAuthenticationRequired(HistoryPage, {
   onRedirecting: () => <div className="text-center p-20">กำลังโหลด หรือ Redirect ไปหน้า Login...</div>,
});