import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, 
        { password }
      );
      setMessage(res.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Set New Password</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="New Password" 
          className="input block w-full mb-4 focus:outline-none" 
          autoComplete="new-password"
          required 
          disabled={loading}
          minLength={6}
        />
        
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          placeholder="Confirm Password" 
          className="input block w-full mb-4 focus:outline-none" 
          autoComplete="new-password"
          required 
          disabled={loading}
          minLength={6}
        />
        
        <button 
          type="submit" 
          className="button bg-primary text-white w-full hover:bg-blue-600 disabled:bg-gray-300" 
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      
      {message && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>{message}</p>
          <p className="text-sm mt-2">Redirecting to login...</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <p className="text-center text-sm text-gray-600 mt-4">
        <Link to="/" className="text-primary hover:underline">Back to Login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;