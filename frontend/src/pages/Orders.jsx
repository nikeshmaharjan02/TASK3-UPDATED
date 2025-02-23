import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Orders = () => {
    const { backendUrl } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/order`, { withCredentials: true });

                if (response.data.success) {
                    setOrders(response.data.orders);
                    
                } else {
                    console.error("Failed to fetch orders:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [backendUrl]);

    if (loading) {
        return <div className="text-center text-xl text-gray-600">Loading your orders...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Your Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center text-xl text-gray-600">
                    <p>You have no orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="p-4 bg-white rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold">Order ID: {order._id}</h2>
                            <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                            <p className="font-semibold">Status: <span className="text-blue-500">{order.status}</span></p>
                            <p className="font-semibold">Total: ${order.totalAmount.toFixed(2)}</p>
                            
                            {/* Loop through all products and show name with quantity */}
                            <p className="font-semibold">Products:</p>
                            <ul className="list-disc pl-5">
                                {order.items.map((item) => (
                                    <li key={item.productId._id} className="text-gray-700">
                                        {item.name} (x{item.quantity}) (${item.price})
                                    </li>
                                ))}
                            </ul>

                            <button 
                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                onClick={() => navigate(`/order/${order._id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
