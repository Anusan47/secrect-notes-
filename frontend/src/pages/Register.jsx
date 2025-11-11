import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || password.length < 8) { setErr('Invalid inputs'); return; }
    try {
      await register(email, password);
      nav('/');
    } catch (err) {
      setErr(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="p-6 bg-white rounded shadow w-full max-w-md" onSubmit={submit}>
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <label className="block mb-2">Email
          <input className="w-full border p-2 rounded mt-1" value={email} onChange={e=>setEmail(e.target.value)} type="email" />
        </label>
        <label className="block mb-4">Password (8+ chars)
          <input className="w-full border p-2 rounded mt-1" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        </label>
        <button className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
