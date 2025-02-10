import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AppContext);

  // If the user is not logged in, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
