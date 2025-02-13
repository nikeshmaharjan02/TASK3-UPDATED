import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const GoogleLoginSuccess = () => {
    const { setUserData } = useContext(AppContext);  // To store user data in context
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Get the user data from the URL query parameter
        const params = new URLSearchParams(location.search);
        const user = params.get('user'); // Extract user data from query params

        if (user) {
            const userData = JSON.parse(decodeURIComponent(user)); // Decode and parse the JSON string
            setUserData(userData);  // Store the user data in context

            // Redirect to the home screen or any other screen after login
            navigate("/homeScreen");
        } else {
            navigate("/login");  // If no user data, redirect to login
        }
    }, [location, setUserData, navigate]);

    return <div>Loading...</div>;  // You can show a loading indicator while processing
};

export default GoogleLoginSuccess;
