import React from 'react'; // Added import
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import QuizIndex from './components/QuizIndex';
import Quiz from './components/Quiz';
import Payment from './components/Payment';
import AdminDashboard from './components/AdminDashboard';
import Leaderboard from './components/Leaderboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { useState } from 'react';
import QuizSession from './components/QuizSession'; // Added missing import

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Login setToken={setToken} setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/quiz-index" element={token ? <QuizIndex /> : <Login setToken={setToken} setRole={setRole} />} />
        <Route path="/quiz/:id" element={token ? <Quiz /> : <Login setToken={setToken} setRole={setRole} />} />
        <Route path="/quiz-session" element={token ? <QuizSession /> : <Login setToken={setToken} setRole={setRole} />} />
        <Route path="/payment" element={token ? <Payment /> : <Login setToken={setToken} setRole={setRole} />} />
        <Route path="/admin" element={role === 'admin' ? <AdminDashboard /> : <Login setToken={setToken} setRole={setRole} />} />
        <Route path="/leaderboard" element={token ? <Leaderboard /> : <Login setToken={setToken} setRole={setRole} />} />
      </Routes>
    </div>
  );
}

export default App;