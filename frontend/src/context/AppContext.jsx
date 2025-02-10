import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [userData, setUserData] = useState(null);

    // Check if the user is authenticated and load user profile data
    const checkSession = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/auth/session', {
                withCredentials: true, // This sends the session cookie along with the request
            });
            console.log(response.data);

            if (response.data.success) {
                setUserData(response.data.user);
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.log("Session check error:", error);
            setUserData(null);  // If error occurs, clear user data
        }
    };

    useEffect(() => {
        checkSession(); // Run session check when component mounts
    }, []);

    // Log userData when it changes (after setUserData updates the state)
    useEffect(() => {
        console.log("userData updated:", userData);
    }, [userData]);

    const value = {
        userData,
        setUserData,
        checkSession,  // Expose the function to be used elsewhere
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
