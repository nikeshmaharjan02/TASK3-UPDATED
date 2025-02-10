import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Extract token from query params
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password and confirm password
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            // Send POST request to the reset password API
            const response = await axios.post(
                `http://localhost:4000/api/auth/reset-password?token=${token}`,
                { password },
                { withCredentials: true } // Ensure session cookie is sent along
            );

            if (response.data.success) {
                console.log("Navigating to /login"); // Add this line for debugging
                toast.success(response.data.message || "Password reset successfully!");
                navigate("/login"); // Redirect to login page
            } else {
                toast.error(response.data.message || "Failed to reset password!");
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            toast.error(
                error.response?.data?.message || "Something went wrong! Please try again."
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Re-enter your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
