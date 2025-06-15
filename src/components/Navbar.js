// src/components/Navbar.js
import React from 'react';
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { HomeIcon, InformationCircleIcon, ClockIcon, PhoneIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

    return (
        <nav className="bg-gray-900 text-gray-200 p-4 shadow-lg sticky top-0 z-50">
          <div className="flex justify-between items-center px-4">
            <Link to="/" className="text-xl font-bold text-white">
              PetCare EyeSense
            </Link>
            <div className="flex items-center space-x-4 md:space-x-6">
              <Link to="/" className="hover:text-yellow-300 flex items-center space-x-1">
                <HomeIcon className="h-5 w-5" /><span>หน้าหลัก</span>
              </Link>
              <Link to="/history" className="hover:text-yellow-300 flex items-center space-x-1">
                 <ClockIcon className="h-5 w-5" /><span>ประวัติ</span>
              </Link>
              {/* Login/Logout Buttons */}
              {!isLoading && !isAuthenticated && (
                  <button onClick={() => loginWithRedirect()} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>เข้าสู่ระบบ</span>
                  </button>
              )}
              {!isLoading && isAuthenticated && (
                  <>
                      <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" />
                      <span className='text-sm hidden lg:inline'>{user.name || user.email}</span>
                      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="hover:text-white flex items-center space-x-1">
                          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                          <span className="hidden md:inline">ออกจากระบบ</span>
                      </button>
                  </>
              )}
            </div>
          </div>
        </nav>
      );
}