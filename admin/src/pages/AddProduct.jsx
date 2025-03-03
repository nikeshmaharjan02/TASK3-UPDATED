import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    tags: "",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Image preview
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(imagePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("tags", productData.tags);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/product/add-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Show success toast message
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form fields
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        tags: "",
      });
      setImages([]);
      setPreviewImages([]);
      document.getElementById("imageInput").value = ""; // Reset file input

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error adding product",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 w-full">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={productData.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Image Upload & Preview */}
          <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <label className="block font-medium text-gray-700 mb-2">
              Upload Images:
            </label>
            <input
              id="imageInput"
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full"
              required
            />
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-full h-20 object-cover rounded-md shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition duration-300"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
