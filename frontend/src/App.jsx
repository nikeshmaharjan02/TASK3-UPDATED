import React, { useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from './context/AppContext';

// Lazy Loading Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const UserHomeScreen = lazy(() => import('./pages/userHomeScreen'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const GoogleLoginSuccess = lazy(() => import('./pages/GoogleLoginSuccess'));
const Products = lazy(() => import('./pages/Products'));
const Cart = lazy(() => import('./pages/Cart'));

const App = () => {
  const { userData } = useContext(AppContext);

  return (
    <Router>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={userData ? <Navigate to="/homeScreen" /> : <Home />} />
          <Route path="/login" element={userData ? <Navigate to="/homeScreen" /> : <Login />} />
          <Route path="/signup" element={userData ? <Navigate to="/homeScreen" /> : <Signup />} />
          <Route path="/homeScreen" element={<UserHomeScreen />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/google-login-success" element={<GoogleLoginSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </Router>
  );
};

export default App;
