import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { registerUser } from "./action/auth.js";
import  { useNavigate } from "react-router-dom";
export  function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleRegister = async() => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    console.log("Register Data:", formData);
   try {
      const respose = await registerUser(formData);
      console.log("Registration Response:", respose);
        // if(respose.success){
        //   navigate("/login");
        //   localStorage.setItem('registeredEmail', formData.email);
        // }
   } catch (error) {
      console.error("Error during registration:", error);
   }

    // send to backend → /register
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 p-4">
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-lg w-full max-w-md">

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="text-purple-600" size={30} />
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        </div>

        {/* Full Name */}
        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          className="w-full px-4 py-3 mb-4 border text-gray-700 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your name"
          onChange={handleChange}
        />

        {/* Email */}
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          className="w-full px-4 py-3 mb-4 border text-gray-700 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your email"
          onChange={handleChange}
        />

        {/* Phone Number */}
        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
        <input
          type="tel"
          name="phone"
          className="w-full px-4 py-3 mb-4 border text-gray-700 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your phone number"
          onChange={handleChange}
        />

        {/* Password */}
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          name="password"
          className="w-full px-4 py-3 mb-6 border text-gray-700 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your password"
          onChange={handleChange}
        />

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 font-semibold rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-lg"
        >
          Register
        </button>

        {/* Go to Login */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span className="text-purple-600 cursor-pointer" onClick={()=>{navigate("/login")}}>Login</span>
        </p>
      </div>
    </div>
  );
}
