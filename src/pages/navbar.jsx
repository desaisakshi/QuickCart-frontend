import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Load Data from Local Storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCart = localStorage.getItem("cartCount");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCart) setCartCount(Number(storedCart));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cartCount");

    setUser(null);
    setCartCount(0);
    setOpenProfile(false);

    navigate("/login"); // FIXED
  };

  // Redirect To Login
  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-[9999]">

      {/* LEFT - Quick Cart */}
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <i className="ri-shopping-cart-2-line text-2xl"></i>

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-lg font-semibold text-black">Quick Cart</span>
      </div>

      {/* RIGHT - Profile Dropdown */}
      <div className="relative" ref={profileRef}>
        <div
          onClick={() => setOpenProfile(!openProfile)}
          className="w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer hover:bg-gray-300"
        >
          <i className="ri-user-line text-xl"></i>
        </div>

        {/* If User Logged In */}
        {openProfile && user && (
          <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <hr className="my-3" />

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        )}

        {/* If User Not Logged In */}
        {openProfile && !user && (
          <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-xl p-4 border border-gray-200">
            <p className="text-gray-600 mb-3">You are not logged in</p>
            <button
              onClick={handleRedirect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
