import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const UserHomeScreen = () => {
    const { userData } = useContext(AppContext);

    if (!userData) {
        return <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Home Screen</h2>
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-500 text-white flex items-center justify-center rounded-full text-4xl font-bold">
                        {userData.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mt-4">{userData.name}</h3>
                    <p className="text-gray-600 text-lg">{userData.email}</p>
                </div>
            </div>
        </div>
    );
};

export default UserHomeScreen;
