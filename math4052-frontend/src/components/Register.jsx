import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { email, password, role });
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Math4052 - Register</h2>
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
          autoComplete="new-password"
          required 
        />
        <select 
          value={role} 
          onChange={e => setRole(e.target.value)} 
          className="input block w-full mb-4 focus:outline-none"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="button bg-primary text-white w-full hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
};

export default Register;