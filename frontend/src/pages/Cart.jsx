import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Cart = () => {
    const { cart, setCart, backendUrl } = useContext(AppContext);

    // Remove item from cart
    const handleRemove = async (productId) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/cart/remove-from-cart`, {
                data: { productId },
                withCredentials: true,
            });

            if (response.data.success) {
                setCart(response.data.cart.items);
            } else {
                console.error("Failed to remove item:", response.data.message);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    // Update item quantity
    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemove(productId);
            return;
        }

        try {
            const response = await axios.put(`${backendUrl}/api/cart/update-cart`, {
                productId,
                quantity: newQuantity,
            }, { withCredentials: true });

            if (response.data.success) {
                setCart(response.data.cart.items);
            } else {
                console.error("Failed to update quantity:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    // Calculate total price
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center text-xl text-gray-600">
                    <p>Your cart is currently empty.</p>
                    <p className="text-lg mt-4">Start shopping to add items here!</p>
                </div>
            ) : (
                <div>
                    {cart.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-4"
                        >
                            <div className="flex items-center">
                                <img
                                    src={item.productId?.image || "https://via.placeholder.com/100"}
                                    alt={item.productId?.name}
                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                />
                                <div>
                                    <p className="text-xl font-semibold">{item.productId?.name}</p>
                                    <p className="text-lg font-medium text-gray-700">
                                        ${item.price.toFixed(2)}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.productId?._id, item.quantity - 1)}
                                            className="px-3 py-1 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                                        >
                                            -
                                        </button>
                                        <span className="mx-3">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.productId?._id, item.quantity + 1)}
                                            className="px-3 py-1 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemove(item.productId?._id)}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                                aria-label={`Remove ${item.productId?.name} from cart`}
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold">Cart Summary</h2>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-lg font-medium">Total</span>
                            <span className="text-xl font-semibold">${getTotalPrice()}</span>
                        </div>
                        <div className="mt-6 text-center">
                            <button
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                onClick={() => alert("Proceeding to checkout...")}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
