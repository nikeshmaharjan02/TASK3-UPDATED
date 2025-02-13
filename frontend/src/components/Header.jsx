import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';

const Header = () => {
    const { backendUrl, userData, setUserData, cart } = useContext(AppContext);
    const navigate = useNavigate();
    
    // Calculate total cart items
    const cartItems = cart.reduce((total, item) => total + item.quantity, 0);

    const logout = async () => {
        try {
            await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
            setUserData(null);
            navigate('/');
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <header className="bg-white shadow-md py-4 relative">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div className="text-2xl font-bold text-black">Task 3</div>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        {!userData && (
                            <>  
                                <li><a href="/" className="text-gray-700 hover:text-blue-500 transition">Home</a></li>
                                <li><a href="/login" className="text-gray-700 hover:text-blue-500 transition">Login</a></li>
                                <li><a href="/signup" className="text-gray-700 hover:text-blue-500 transition">Sign Up</a></li>
                            </>
                        )}
                        {userData && (
                            <>
                                <li><a href="/homeScreen" className="text-gray-700 hover:text-blue-500 transition">Home</a></li>
                                <li><a href="/products" className="text-gray-700 hover:text-blue-500 transition">Products</a></li>
                                <li className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                                    <FaShoppingCart className="text-gray-700 text-2xl" />
                                    {cartItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{cartItems}</span>
                                    )}
                                </li>
                                <li className="relative group">
                                    <FaUserCircle className="text-gray-700 text-2xl cursor-pointer" />
                                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                            <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                            <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                                        </div>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
