// src/pages/LoginPage.js
import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State สำหรับเก็บข้อความ Error
  const navigate = useNavigate(); // 2. เรียกใช้ Hook

  const handleLogin = async (e) => { // 3. เปลี่ยนเป็น async function
    e.preventDefault();
    setError(''); // ล้าง Error เก่าก่อน

    // --- 4. ส่วนเชื่อมต่อ Backend ---
    // !!! เปลี่ยน URL นี้เป็น URL ของ Backend API จริงของคุณ !!!
    const backendUrl = 'http://localhost:5000/api/v1/login'; // หรือ http://your-backend-domain.com/api/v1/login

    try {
      const response = await fetch(backendUrl, {
        method: 'POST', // ใช้เมธอด POST
        headers: {
          'Content-Type': 'application/json', // บอกว่าส่งข้อมูลแบบ JSON
        },
        body: JSON.stringify({ email, password }), // แปลงข้อมูลเป็น JSON string
      });

      const data = await response.json(); // แปลง JSON ที่ตอบกลับมา

      if (response.ok) { // ตรวจสอบว่า Backend ตอบกลับว่าสำเร็จ (status code 2xx)
        console.log('Login successful:', data);
        // --- จัดการหลัง Login สำเร็จ ---
        // สมมติว่า Backend ส่ง token กลับมาใน data.token
        if (data.token) {
          localStorage.setItem('authToken', data.token); // เก็บ Token ไว้ใน Local Storage (ตัวอย่าง)
          // อาจจะต้องอัปเดต State ที่เก็บสถานะ Login ใน App หลัก (ถ้ามี)
          navigate('/'); // 5. Redirect ไปหน้าหลัก
        } else {
           setError('Login สำเร็จ แต่ไม่ได้รับ Token.'); // กรณีผิดพลาดที่ไม่คาดคิด
        }
      } else {
        // ถ้า Backend ตอบกลับว่าไม่สำเร็จ (เช่น 401, 400)
        setError(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'); // แสดง Error จาก Backend หรือข้อความ Default
      }
    } catch (err) {
      // ถ้าเกิด Error ตอนเชื่อมต่อ (เช่น Network Error)
      console.error('Login API error:', err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ ไม่สามารถเข้าสู่ระบบได้');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          เข้าสู่ระบบ PetEye AI
        </h2>

        {/* แสดงข้อความ Error ถ้ามี */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* ... ส่วน Input Fields เหมือนเดิม ... */}
           {/* Email Input */}
           <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">อีเมล</label>
            <input
              type="email"
              id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="กรอกอีเมลของคุณ" required
            />
          </div>
          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">รหัสผ่าน</label>
            <input
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="******************" required
            />
          </div>
          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full">
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;