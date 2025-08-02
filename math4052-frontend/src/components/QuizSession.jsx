import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Latex from 'react-latex-next';
import { jwtDecode } from 'jwt-decode'; // Updated import
import axios from 'axios';

const QuizSession = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('quizSession')) || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [sessionScore, setSessionScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (questions.length === 0) navigate('/quiz-index');
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
  }, [currentIndex, submitted]);

  const handleSubmit = async () => {
    setSubmitted(true);
    const isCorrect = selected === currentQuestion.correctAnswer;
    setCorrect(isCorrect);
    setFeedback(isCorrect ? 'Great job!' : 'Not quite.');
    playSound(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setSessionScore(sessionScore + 100 / questions.length);
    const userId = jwtDecode(localStorage.getItem('token')).id; // Updated to jwtDecode
    await axios.post(`${import.meta.env.VITE_API_URL}/api/progress`, {
      userId,
      questionId: currentQuestion._id,
      attempts: 1,
      correct: isCorrect,
      score: isCorrect ? 100 / questions.length : 0,
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

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setSubmitted(false);
      setShowAnswer(false);
      setTimeLeft(60);
    } else {
      setShowSummary(true);
    }
  };

  if (showSummary) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Summary</h2>
        <p className="text-lg">Your score: {Math.round(sessionScore)}%</p>
        <button onClick={() => navigate('/quiz-index')} className="button bg-primary text-white mt-4 hover:bg-blue-600">Back to Index</button>
      </div>
    );
  }

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 relative">
      <h2 className="text-xl font-semibold text-gray-900 mb-4"><Latex>{currentQuestion.text}</Latex></h2>
      <p className="text-red-500 mb-4">Time left: {timeLeft}s</p>
      <div className="progress-bar mb-6">
        <div className="progress-fill" style={{ width: `${(currentIndex / questions.length) * 100}%` }}></div>
      </div>
      <ul className="space-y-3">
        {currentQuestion.options.map((opt, idx) => (
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
                  {idx === currentQuestion.correctAnswer ? (
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
            <button onClick={handleNext} className="button bg-primary text-white flex-1 hover:bg-blue-600">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSession;