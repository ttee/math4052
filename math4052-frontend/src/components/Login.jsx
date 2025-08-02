import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setToken, setRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setToken(res.data.token);
      setRole(res.data.role);
      navigate(res.data.role === 'admin' ? '/admin' : '/quiz-index');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Math4052 - Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          className="input block w-full mb-4 focus:outline-none" 
          autoComplete="email"
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          className="input block w-full mb-4 focus:outline-none" 
          autoComplete="current-password"
          required 
        />
        <button type="submit" className="button bg-primary text-white w-full hover:bg-blue-600">Login</button>
      </form>
      <div className="mt-4 space-y-2">
        <p className="text-center text-sm text-gray-600">
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot your password?</Link>
        </p>
        <p className="text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;