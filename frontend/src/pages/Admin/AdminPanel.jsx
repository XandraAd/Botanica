// Admin Panel Component
import React,{useState} from "react";
export default function AdminPanel() {
    const [products, setProducts] = useState([
      {
        id: 1,
        name: "Matte Lipstick - Ruby Red",
        price: 19.99,
        category: "Lipstick"
      },
      {
        id: 2,
        name: "Eyeshadow Palette - Desert Rose",
        price: 34.99,
        category: "Eyeshadow"
      },
      {
        id: 3,
        name: "Foundation - Natural Beige",
        price: 29.99,
        category: "Foundation"
      }
    ]);
    const [formData, setFormData] = useState({
      name: '',
      category: '',
      price: ''
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const newProduct = {
        id: products.length + 1,
        ...formData,
        price: parseFloat(formData.price)
      };
      setProducts([...products, newProduct]);
      setFormData({
        name: '',
        category: '',
        price: ''
      });
    };
  
    const deleteProduct = (id) => {
      setProducts(products.filter(product => product.id !== id));
    };
  
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Lipstick">Lipstick</option>
                  <option value="Eyeshadow">Eyeshadow</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Blush">Blush</option>
                  <option value="Mascara">Mascara</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
              >
                Add Product
              </button>
            </form>
          </div>
          </div>
        </div>
      </div>
    );
  }