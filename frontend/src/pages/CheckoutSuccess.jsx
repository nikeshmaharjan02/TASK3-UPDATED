import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CheckoutSuccess = () => {
    const navigate = useNavigate();

    // Redirect user to home after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 15000); // Redirect after 5 seconds

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold text-green-600">Checkout Successful!</h1>
            <p className="text-lg mt-4 text-gray-700">Thank you for your purchase. Your order has been placed successfully. You can track it in your orders section</p>
            <p className="text-gray-500 mt-2">You will be redirected to the homepage shortly...</p>
            <button 
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                onClick={() => navigate("/")}
            >
                Go to Home
            </button>
        </div>
    );
};

export default CheckoutSuccess;
