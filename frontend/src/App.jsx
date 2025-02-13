import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import UserHomeScreen from './pages/userHomeScreen';
import ResetPassword from './pages/ResetPassword';
import { AppContext } from './context/AppContext';
import GoogleLoginSuccess from './pages/GoogleLoginSuccess';
import Products from './pages/Products';
import Cart from './pages/Cart';

const App = () => {
  const { userData } = useContext(AppContext);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={userData ? <Navigate to="/homeScreen" /> : <Home />} />
        <Route path="/login" element={userData ? <Navigate to="/homeScreen" /> : <Login />} />
        <Route path="/signup" element={userData ? <Navigate to="/homeScreen" /> : <Signup />} />
        <Route path="/homeScreen" element={<UserHomeScreen />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/google-login-success" element={<GoogleLoginSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
