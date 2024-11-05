// src/components/Products.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    toast.success("Logged out safely!");
    setTimeout(() => {
      nav('/');
    }, 1000);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data.products || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-container">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <button onClick={() => nav('/user-reviews')}>My Reviews</button>
      <h2>Products</h2>
      <input 
        type="text" 
        placeholder="Search products..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input" 
      />
      

      {/* Fixed container around products list */}
      <div className="products-list-wrapper">
        <div className="products-list">
          {filteredProducts.map(product => (
            <div className="product-row" key={product.id}>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: AED {product.price}</p>
                <Link to={`/products/${product.id}`}>
                <button className="details-button">View Details</button>
              </Link>
              </div>
              
            </div>
          ))}
          {filteredProducts.length === 0 && <p>No products found.</p>}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Products;
