import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) { setErr('Fill all fields'); return; }
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="p-6 bg-white rounded shadow w-full max-w-md" onSubmit={submit}>
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <label className="block mb-2">Email
          <input className="w-full border p-2 rounded mt-1" value={email} onChange={e=>setEmail(e.target.value)} type="email" />
        </label>
        <label className="block mb-4">Password
          <input className="w-full border p-2 rounded mt-1" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        </label>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        <div className="mt-3 text-sm">
          <Link to="/forgot" className="text-blue-600">Forgot password?</Link>
        </div>
        <div className="mt-3 text-sm">
          <span>Don't have an account? </span><Link to="/register" className="text-blue-600">Register</Link>
        </div>
      </form>
    </div>
  );
}
