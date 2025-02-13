import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Products = () => {
    const { cart, setCart, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('newest');
    const [category, setCategory] = useState('');
    
    // State for quantity of each product
    const [quantities, setQuantities] = useState({});

    const fetchProducts = async () => {
        try {
            const query = new URLSearchParams({ page, limit, min_price: minPrice, max_price: maxPrice, sort, category }).toString();
            const response = await axios.get(`${backendUrl}/api/product/get-products?${query}`, { withCredentials: true });
            if (response.data.success) {
                setProducts(response.data.data);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(response.data.message || 'Failed to load products');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Something went wrong! Please try again!');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, limit, minPrice, maxPrice, sort, category]);

    // Update quantity for each product
    const handleQuantityChange = (productId, value) => {
        if (value < 1) return; // Prevent zero or negative values
        setQuantities((prev) => ({ ...prev, [productId]: value }));
    };

    const handleAddToCart = async (product) => {
        const quantity = quantities[product._id] || 1; 

        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/add-to-cart`,
                { productId: product._id, quantity },
                { withCredentials: true }
            );
            
            if (response.data.success) {
                setCart(response.data.cart.items);
                toast.success(`${product.name} added to cart!`);
            } else {
                toast.error(response.data.message || 'Failed to add to cart');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong! Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Shop Our Collection</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-5 rounded-lg shadow-lg transform transition-transform hover:scale-105 flex flex-col h-full">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{product.name}</h2>
                        <p className="text-gray-600 flex-grow">{product.description.substring(0, 50)}...</p>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-blue-600">${product.price}</span>
                        </div>
                        <div className="flex items-center mt-4">
                            <label className="mr-2 font-semibold">Quantity:</label>
                            <input
                                type="number"
                                value={quantities[product._id] || 1}
                                min="1"
                                onChange={(e) => handleQuantityChange(product._id, Number(e.target.value))}
                                className="w-16 px-2 py-1 border rounded-lg text-center"
                            />
                        </div>
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add to Cart
                        </button>
                    </div>

                ))}
            </div>
            <div className="flex justify-center mt-6">
                <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-4 py-2 bg-gray-300 rounded-lg disabled:bg-gray-500">Previous</button>
                <span className="mx-4 text-lg">{`Page ${page} of ${totalPages}`}</span>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-4 py-2 bg-gray-300 rounded-lg disabled:bg-gray-500">Next</button>
            </div>
            <p className="text-center mt-6">
                <Link to="/checkout" className="text-blue-500 hover:underline text-lg">Proceed to Checkout</Link>
            </p>
        </div>
    );
};

export default Products;
