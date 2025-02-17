import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const Home = () => {
    const { backendUrl, setUserData, user } = useContext(AppContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('newest');
    const [category, setCategory] = useState('');
    
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Temporary state for debounce

    // Fetch products from backend
    const fetchProducts = async () => {
        try {
            const query = new URLSearchParams({
                page, limit, min_price: minPrice, max_price: maxPrice, sort, category, search
            }).toString();
            
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

    // Effect to fetch products when dependencies change
    useEffect(() => {
        fetchProducts();
    }, [page, limit, minPrice, maxPrice, sort, category, search]); // Updated dependencies

    // Debounced search function
    const debouncedSearch = useCallback(debounce((value) => {
        setSearch(value);
        setPage(1);
    }, 500), []);

    // Update searchQuery state when input changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update UI immediately
        debouncedSearch(e.target.value); // Call debounced function
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Shop Our Collection</h1>
            
            <div className="mb-6 flex flex-wrap justify-between bg-gray-100 p-4 rounded-lg shadow">
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300" 
                    value={searchQuery} // Use searchQuery for immediate UI updates
                    onChange={handleSearchChange} 
                />
                
                <div className="flex items-center space-x-4">
                    <input type="number" name="minPrice" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300" />
                    <input type="number" name="maxPrice" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300" />
                </div>
                
                <div className="flex items-center space-x-4">
                    <select name="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300">
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="views">Views</option>
                        <option value="popularity">Popularity</option>
                        <option value="reviews">Reviews</option>
                    </select>
                    <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300">
                        <option value="">All Categories</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="jewellery">Jewellery</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-5 rounded-lg shadow-lg transform transition-transform hover:scale-105">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                        <p className="text-gray-600 mb-4">{product.description.substring(0, 50)}...</p>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-blue-600">${product.price}</span>
                            <button onClick={() => handleAddToCart(product)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">Add to Cart</button>
                        </div>
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

export default Home;
