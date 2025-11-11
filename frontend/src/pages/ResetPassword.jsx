import React, { useState } from 'react';
import API from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setMsg('Password must be 8+ chars'); return; }
    try {
      await API.post(`/auth/reset/${token}`, { password });
      setMsg('Password reset, redirecting...');
      setTimeout(()=>nav('/'), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="p-6 bg-white rounded shadow w-full max-w-md" onSubmit={submit}>
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        {msg && <div className="mb-2">{msg}</div>}
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full border p-2 rounded mb-4" placeholder="new password (8+ chars)" />
        <button className="w-full bg-green-600 text-white py-2 rounded">Reset Password</button>
      </form>
    </div>
  );
}
