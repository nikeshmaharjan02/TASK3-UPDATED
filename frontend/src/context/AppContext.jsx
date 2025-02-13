import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [userData, setUserData] = useState(null);
    const [cart, setCart] = useState([]);

    // Check if the user is authenticated and load user profile data
    const checkSession = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/auth/session', {
                withCredentials: true, 
            });

            if (response.data.success) {
                setUserData(response.data.user); // Update state
            } else {
                setUserData(null);
                setCart([]); // Clear cart if no user
            }
        } catch (error) {
            console.log("Session check error:", error);
            setUserData(null); 
            setCart([]); // Clear cart if error
        }
    };

    // Fetch cart only when userData is available
    const fetchCart = async () => {
       

        if (!userData) {
            console.warn("Skipping fetchCart because userData is null");
            return;
        }

        try {
            const response = await axios.get(`${backendUrl}/api/cart`, { withCredentials: true });
            

            if (response.data.success) {
                setCart(response.data.cart.items);
            } else {
                console.error("Failed to fetch cart:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        checkSession(); // Run on mount
    }, []);

    useEffect(() => {
        if (userData) {
            fetchCart(); // Fetch cart only when userData updates
        }
    }, [userData]);

    return (
        <AppContext.Provider value={{ backendUrl, userData, setUserData, cart, setCart, checkSession }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
