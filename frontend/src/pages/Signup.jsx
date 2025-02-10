import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Signup = () => {
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();  // Use navigate to redirect after successful signup

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/auth/register", formValues, { withCredentials: true }); // withCredentials for session cookies

            if (response.data.success) {
                toast.success(response.data.message || "Registration Successful");
                setFormValues({ name: "", email: "", password: "" });
                navigate("/login");  // Redirect to login page after successful signup
            } else {
                toast.error(response.data.message || "Registration Failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error(
                error.response?.data?.error || error.response?.data?.message || "Something went wrong! Please try again!"
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={formValues.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-blue-500 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
