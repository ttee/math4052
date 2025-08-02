import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/progress/leaderboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLeaderboard(res.data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Math4052 - Leaderboard</h2>
      <ul className="space-y-4">
        {leaderboard.map((entry, idx) => (
          <li key={idx} className="p-4 bg-gray-50 rounded-md flex justify-between">
            <span>{entry.username}</span>
            <span>{entry.totalScore} points</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;