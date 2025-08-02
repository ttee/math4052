import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { jwtDecode } from 'jwt-decode'; // Updated import

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestion(res.data);
    };
    const fetchProgress = async () => {
      const userId = jwtDecode(localStorage.getItem('token')).id; // Updated to jwtDecode
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/progress/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const prog = res.data.find(p => p.questionId === id);
      if (prog) {
        setAttempts(prog.attempts);
        setCorrect(prog.correct);
        setProgress(prog.correct ? 100 : (prog.attempts / 3) * 100);
      }
    };
    fetchQuestion();
    fetchProgress();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleSubmit();
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleSubmit = async () => {
    setSubmitted(true);
    setAttempts(attempts + 1);
    const isCorrect = selected === question.correctAnswer;
    setCorrect(isCorrect);
    setProgress(isCorrect ? 100 : Math.min((attempts + 1) / 3 * 100, 100));
    setFeedback(isCorrect ? 'Great job! You got it right.' : 'Not quite. Try again to learn!');
    playSound(isCorrect ? 'correct' : 'wrong');
    const userId = jwtDecode(localStorage.getItem('token')).id; // Updated to jwtDecode
    await axios.post(`${import.meta.env.VITE_API_URL}/api/progress`, {
      userId,
      questionId: id,
      attempts: attempts + 1,
      correct: isCorrect,
      score: isCorrect ? 100 : 0,
    }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  };

  const playSound = (type) => {
    // Disable sound for now - can be enabled by adding MP3 files to public/sounds/
    return;
    
    try {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.play().catch(err => {
        // Silently ignore audio errors - sounds are optional
        console.log(`Sound ${type} not available:`, err.message);
      });
    } catch (err) {
      // Silently ignore if audio files don't exist
      console.log(`Sound ${type} not available:`, err.message);
    }
  };

  const handleTryAgain = () => {
    setSelected(null);
    setSubmitted(false);
    setShowAnswer(false);
    setFeedback('Give it another shot! Learning comes from practice.');
    setTimeLeft(60);
  };

  const handleSeeAnswer = () => setShowAnswer(true);

  const handleWhy = () => setShowExplanation(true);

  const handleContinue = () => navigate('/quiz-index');

  const handleQuitClick = () => setShowQuitModal(true);

  if (!question) return <div className="text-center mt-20 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 relative">
      <button onClick={handleQuitClick} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl">&times;</button>
      <h2 className="text-xl font-semibold text-gray-900 mb-4"><Latex>{question.text}</Latex></h2>
      <p className="text-red-500 mb-4">Time left: {timeLeft}s</p>
      <div className="progress-bar mb-6">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <ul className="space-y-3">
        {question.options.map((opt, idx) => (
          <li key={idx}>
            <button
              onClick={() => !submitted && setSelected(idx)}
              className={`option-button w-full p-4 text-left border border-gray-200 rounded-md transition-colors hover:bg-blue-50 hover:border-primary ${selected === idx ? 'bg-yellow-100 border-yellow-300' : ''} disabled:cursor-not-allowed`}
              disabled={submitted}
              aria-label={`Option ${idx + 1}: ${opt.replace(/\\\(.*?\\\)/g, 'math equation')}`}
            >
              <Latex>{opt}</Latex>
              {submitted && showAnswer && (
                <span className="ml-2 inline-block">
                  {idx === question.correctAnswer ? (
                    <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : selected === idx ? (
                    <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : null}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {!submitted ? (
        <button onClick={handleSubmit} className="button bg-primary text-white w-full mt-6 hover:bg-blue-600 disabled:bg-gray-300" disabled={selected === null}>Check</button>
      ) : (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className={`text-sm font-medium ${correct ? 'text-success' : 'text-error'}`}>{feedback}</p>
          <div className="flex space-x-2 mt-4">
            <button onClick={handleTryAgain} className="button bg-yellow-500 text-white flex-1 hover:bg-yellow-600">Try Again</button>
            <button onClick={handleSeeAnswer} className="button bg-green-500 text-white flex-1 hover:bg-green-600">See Answer</button>
            <button onClick={handleWhy} className="button bg-purple-500 text-white flex-1 hover:bg-purple-600">Why?</button>
            <button onClick={handleContinue} className="button bg-primary text-white flex-1 hover:bg-blue-600">Continue</button>
          </div>
        </div>
      )}
      {showQuitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="text-gray-700 mb-4">Are you sure you want to quit? Progress will be saved.</p>
            <div className="flex space-x-2">
              <button onClick={() => { setShowQuitModal(false); navigate('/quiz-index'); }} className="button bg-error text-white flex-1 hover:bg-red-600">Quit</button>
              <button onClick={() => setShowQuitModal(false)} className="button bg-success text-white flex-1 hover:bg-green-600">Continue Learning</button>
            </div>
          </div>
        </div>
      )}
      {showExplanation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Explanation</h3>
            <p className="text-gray-700 whitespace-pre-line"><Latex>{question.explanation}</Latex></p>
            <button onClick={() => setShowExplanation(false)} className="button bg-primary text-white w-full mt-4 hover:bg-blue-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;