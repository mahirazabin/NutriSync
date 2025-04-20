import { useState, FormEvent, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Signup(): JSX.Element {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [phoneNo, setPhoneNo]   = useState('');
  const [error, setError]       = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, password, phone_no: phoneNo })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }
      navigate('/login');
    } catch(err: any) {
      setError(err.message);
    }
  };

  return (
    <><Navbar />
    <form onSubmit={handleSubmit} style={{ padding: 16 }}>
          <h2>Sign Up</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required />
          <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required />
          <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required />
          <input
              placeholder="Phone Number"
              type="tel"
              value={phoneNo}
              onChange={e => setPhoneNo(e.target.value)}
              required />
          <button type="submit">Sign Up</button>
      </form></>
  );
}