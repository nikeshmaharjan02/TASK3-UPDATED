import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/auth/forgot-password", { email }, { withCredentials: true });

            if (response.data.success) {
                toast.success(response.data.message);
                // Optionally redirect user to login page or display a success message
                navigate("/login");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            toast.error(
                error.response?.data?.error || 
                error.response?.data?.message || 
                "Something went wrong! Please try again!"
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
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
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
