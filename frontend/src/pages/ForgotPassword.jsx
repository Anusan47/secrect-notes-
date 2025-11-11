import React, { useState } from 'react';
import API from '../api/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/forgot', { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg('Error sending reset');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="p-6 bg-white rounded shadow w-full max-w-md" onSubmit={submit}>
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        {msg && <div className="mb-2">{msg}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full border p-2 rounded mb-4" placeholder="your email" />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Send Reset Link</button>
      </form>
    </div>
  );
}
