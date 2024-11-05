// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProductDetails from './components/ProductDetails';
import Products from './components/Products';
import UserReviews from './components/UserReviews';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/products" element={<PrivateRoute> <Products /> </PrivateRoute>}/>
        <Route path="/products/:productId" element={<PrivateRoute> <ProductDetails /> </PrivateRoute>}/>
        <Route path="/user-reviews" element={ <PrivateRoute> <UserReviews /> </PrivateRoute> }/>
      </Routes>
    </Router>
  );
};

export default App;
