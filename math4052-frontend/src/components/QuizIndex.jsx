import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const QuizIndex = () => {
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestions(res.data);
    };
    fetchQuestions();
  }, []);

  const startQuizSession = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions/random/5`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    // Store session questions in localStorage or state management
    localStorage.setItem('quizSession', JSON.stringify(res.data));
    navigate('/quiz-session');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Math4052 - Available Quizzes</h2>
      <button onClick={startQuizSession} className="button bg-primary text-white mb-6 hover:bg-blue-600">Start Multi-Question Quiz</button>
      <ul className="space-y-4">
        {questions.map(q => (
          <li key={q._id} className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <Link to={`/quiz/${q._id}`} className="text-primary font-medium hover:underline">{q.text.replace(/\\\(.*?\\\)/g, '(math equation)')}</Link>
          </li>
        ))}
      </ul>
      <Link to="/payment" className="block mt-6 text-center button bg-green-500 text-white hover:bg-green-600">Pay to Unlock More</Link>
      <Link to="/leaderboard" className="block mt-4 text-center button bg-purple-500 text-white hover:bg-purple-600">View Leaderboard</Link>
    </div>
  );
};

export default QuizIndex;