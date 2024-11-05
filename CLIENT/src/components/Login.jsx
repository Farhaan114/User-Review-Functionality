import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      const { token, userId, role } = response.data;

      if (token && userId) {
        // Store token, userId, and role in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('role', role);

        // Display success message
        toast.success('Login successful!');
        // Navigate immediately after success
        navigate('/Products');
      } else {
        // Show error if token or userId is missing in the response
        toast.error('Login failed! Please check your credentials.');
      }
    } catch (error) {
      // Show specific error message if available, else show generic error
      const errorMessage = error.response?.data?.message || 'Invalid Credentials!';
      console.error('Login error:', errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <button type="submit">Login</button>
      </form>
      <a href='/register'>
        New User? Register here.
      </a>
      <ToastContainer />
    </div>
  );
};

export default Login;
