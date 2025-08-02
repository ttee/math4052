import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setResetLink('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
      
      // In development, show the reset link
      if (res.data.resetLink) {
        setResetLink(res.data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>
      
      <form onSubmit={handleSubmit}>
        <p className="text-gray-600 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          className="input block w-full mb-4 focus:outline-none" 
          autoComplete="email"
          required 
          disabled={loading}
        />
        
        <button 
          type="submit" 
          className="button bg-primary text-white w-full hover:bg-blue-600 disabled:bg-gray-300" 
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      
      {message && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {resetLink && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <p className="text-sm mb-2">Development mode - Reset link:</p>
          <a href={resetLink} className="text-blue-600 underline break-all text-xs">
            {resetLink}
          </a>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <p className="text-center text-sm text-gray-600 mt-4">
        Remember your password? <Link to="/" className="text-primary hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;