import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const { backendUrl, setUserData, checkSession } = useContext(AppContext);  // Using setUserData instead of setToken
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password }, { withCredentials: true });


            if (response.data.success) {
                toast.success(response.data.message || "Login Successful");
                // Set user data from session response (directly from the backend response)
                setUserData(response.data.user);  // This now stores user info in the context
                checkSession();
                navigate("/homeScreen");
            } else {
                toast.error(response.data.message || "Login Failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error(
                error.response?.data?.error || 
                error.response?.data?.message || 
                "Something went wrong! Please try again!"
            );
        }
    };

    // Handle Google login redirect
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:4000/api/auth/google"; 
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        Login
                    </button>
                </form>

                {/* Google Login Button */}
                <div className="mt-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Login with Google
                    </button>
                </div>

                <p className="text-center mt-4">
                    <Link
                        to="/forgot-password"
                        className="text-blue-500 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </p>
                <p className="text-center mt-2">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="text-blue-500 hover:underline"
                    >
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
