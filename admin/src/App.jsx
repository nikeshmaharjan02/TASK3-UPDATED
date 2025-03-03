import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UsersList';
import SalesReport from './pages/SalesReport';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';
import TotalReport from './pages/TotalReport';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/session', {
          withCredentials: true, // Make sure the session cookie is included in the request
        });

        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#F8F9FD]">
      <ToastContainer /> {/* Always render ToastContainer */}
      {isAuthenticated ? (
        <>
          <Navbar setIsAuthenticated={setIsAuthenticated}/>
          <div className="flex items-start">
            <Sidebar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/users-list" element={<UsersList />} />
              <Route path="/sales-report" element={<SalesReport />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/total-report" element={<TotalReport />} />

            </Routes>
          </div>
        </>
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated}/>
      )}
    </div>
  );
};

export default App;
