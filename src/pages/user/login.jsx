import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { loginUser } from "./action/auth.js";
import { useNavigate } from "react-router-dom";
export  function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async() => {
    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }
    try {
       const respose = await loginUser(formData);
    if (respose.token) {
  // Store token
  localStorage.setItem('token', respose.token);

  // Store user data
  localStorage.setItem("user", JSON.stringify({
    name: respose.user.name,
    email: respose.user.email,
    phone: respose.user.phone,
    id: respose.user.id,
    role: respose.user.role
  }));

  localStorage.setItem('role',respose.user.role)

  // Redirect based on role
  if (respose.user.role === "customer") {
    navigate("/customer-dashboard");
  } 
  else if (respose.user.role === "checker") {
    navigate("/checker-dashboard");
  }
  else if (respose.user.role === "admin") {
    navigate("/admin-dashboard");
  }
  else {
    navigate("/"); // fallback
  }
}

    } catch (error) {
      
    }

    // send to backend → /login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 to-cyan-500 p-4">
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-lg w-full max-w-md">

        <div className="flex items-center gap-2 mb-6">
          <LogIn className="text-blue-600" size={30} />
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
        </div>

        {/* Email */}
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          className="w-full px-4 py-3 mb-4 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          onChange={handleChange}
        />

        {/* Password */}
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          name="password"
          className="w-full px-4 py-3 mb-6 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
          onChange={handleChange}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 font-semibold rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-lg"
        >
          Login
        </button>

        {/* Go to Register */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={()=>{navigate("/register")}}>Register</span>
        </p>
      </div>
    </div>
  );
}
