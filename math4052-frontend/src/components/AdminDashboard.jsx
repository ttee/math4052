import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' });
  const [editingId, setEditingId] = useState(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const qRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestions(qRes.data);

      const uRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(uRes.data);
    };
    fetchData();
  }, []);

  const handleAddOrUpdateQuestion = async () => {
    if (editingId) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/questions/${editingId}`, newQuestion, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditingId(null);
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/questions`, newQuestion, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    }
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setQuestions(res.data);
    setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' });
  };

  const handleEditQuestion = (q) => {
    setNewQuestion(q);
    setEditingId(q._id);
  };

  const handleDeleteQuestion = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/questions/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setQuestions(questions.filter(q => q._id !== id));
  };

  const handleAddOrUpdateUser = async () => {
    if (editingUserId) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${editingUserId}`, newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditingUserId(null);
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    }
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setUsers(res.data);
    setNewUser({ email: '', password: '', role: 'user' });
  };

  const handleEditUser = (u) => {
    setNewUser({ email: u.email, role: u.role, password: '' }); // Password optional for update
    setEditingUserId(u._id);
  };

  const handleDeleteUser = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Math4052 - Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Manage Questions</h3>
          <input
            type="text"
            value={newQuestion.text}
            onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
            placeholder="Question text (use \\( math \\))"
            className="input block w-full mb-4 focus:outline-none"
          />
          {newQuestion.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={e => {
                const opts = [...newQuestion.options];
                opts[idx] = e.target.value;
                setNewQuestion({ ...newQuestion, options: opts });
              }}
              placeholder={`Option ${idx + 1}`}
              className="input block w-full mb-4 focus:outline-none"
            />
          ))}
          <select
            value={newQuestion.correctAnswer}
            onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: parseInt(e.target.value) })}
            className="input block w-full mb-4 focus:outline-none"
          >
            {newQuestion.options.map((_, idx) => <option key={idx} value={idx}>Correct: Option {idx + 1}</option>)}
          </select>
          <textarea
            value={newQuestion.explanation}
            onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
            placeholder="Explanation (use \n for steps)"
            className="input block w-full mb-4 focus:outline-none h-32"
          />
          <button onClick={handleAddOrUpdateQuestion} className="button bg-primary text-white w-full hover:bg-blue-600">{editingId ? 'Update' : 'Add'} Question</button>
          <ul className="mt-6 space-y-4">
            {questions.map(q => (
              <li key={q._id} className="p-4 bg-gray-50 rounded-md flex justify-between items-center">
                <span className="text-gray-700">{q.text.replace(/\\\(.*?\\\)/g, '(math)')}</span>
                <div>
                  <button onClick={() => handleEditQuestion(q)} className="text-primary mr-2 hover:underline">Edit</button>
                  <button onClick={() => handleDeleteQuestion(q._id)} className="text-error hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Manage Users</h3>
          <input
            type="email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            className="input block w-full mb-4 focus:outline-none"
          />
          <input
            type="password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Password (optional for update)"
            className="input block w-full mb-4 focus:outline-none"
          />
          <select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            className="input block w-full mb-4 focus:outline-none"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleAddOrUpdateUser} className="button bg-primary text-white w-full hover:bg-blue-600">{editingUserId ? 'Update' : 'Add'} User</button>
          <ul className="mt-6 space-y-4">
            {users.map(u => (
              <li key={u._id} className="p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-700 font-medium">{u.email}</p>
                    <p className="text-sm text-gray-500">Role: {u.role}</p>
                    <p className="text-sm text-gray-500">Created: {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => handleEditUser(u)} className="text-primary text-sm hover:underline">Edit</button>
                    <button onClick={() => handleDeleteUser(u._id)} className="text-error text-sm hover:underline">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;