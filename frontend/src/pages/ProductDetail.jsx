import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
    const { backendUrl, setCart } = useContext(AppContext);
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/product/get-product/${id}`, { withCredentials: true });
                if (response.data.success) {
                    setProduct(response.data.data);
                } else {
                    toast.error(response.data.message || 'Failed to load product details');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Something went wrong! Please try again.');
            }
        };

        fetchProductDetails();
    }, [id, backendUrl]);

    const handleQuantityChange = (value) => {
        if (value < 1) return; // Prevent negative or zero quantities
        setQuantity(value);
    };

    const handleAddToCart = async () => {
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

    if (!product) return <div className="text-center py-8">Loading...</div>;

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Product Image Carousel */}
                <div className="flex justify-center flex-col items-center">
                    <div className="relative w-full h-96 mb-6">
                        {/* Display current image */}
                        <img
                            src={product.images[currentImageIndex]} // Display the current image
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg shadow-xl"
                        />
                        {/* Navigation buttons for the carousel */}
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                        >
                            &#8594;
                        </button>
                    </div>

                    {/* Thumbnail Image Navigation */}
                    <div className="flex gap-2">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${product.name}-thumbnail-${index}`}
                                className={`w-16 h-16 object-cover rounded-lg cursor-pointer ${index === currentImageIndex ? 'border-4 border-blue-600' : ''}`}
                                onClick={() => setCurrentImageIndex(index)} // Update main image on click
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-between">
                    <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
                    <p className="text-xl text-gray-600 mt-4">{product.description}</p>
                    <div className="flex gap-6 mt-6 items-center">
                        <span className="text-3xl font-semibold text-blue-600">${product.price}</span>
                        <span className="text-sm text-gray-500">Available in stock</span>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="mt-6 flex items-center gap-4">
                        <label htmlFor="quantity" className="font-semibold text-lg">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            min="1"
                            onChange={(e) => handleQuantityChange(Number(e.target.value))}
                            className="w-16 px-2 py-1 border rounded-lg text-center"
                        />
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleAddToCart}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate('/products')}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
