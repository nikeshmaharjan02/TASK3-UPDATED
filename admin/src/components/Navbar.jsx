import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });

      if (response.data.success) {
        toast.success(response.data.message || 'Logout successful');
        
        // Set authentication to false
        setIsAuthenticated(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An error occurred during logout.");
    }
  };

  // Check the authentication status change and redirect after it's updated
  useEffect(() => {
    if (!setIsAuthenticated) {
      // If the authentication state changes, navigate to the home page
      navigate('/', { replace: true });
    }
  }, [setIsAuthenticated, navigate]);

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <p className="w-36 sm:w-40 cursor-pointer"> Task 3 </p>
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600"> Admin </p>
      </div>
      <button onClick={logout} className="bg-primary text-white text-sm px-10 py-2 rounded-full">Logout</button>
    </div>
  );
}

export default Navbar;
