import { useState, FormEvent, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Login(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
  
      const data = await res.json();
      const userId = data.user.UserID;
      const userRole = data.user.Role;  
      console.log(userId, userRole)
      switch (userRole) {
        case 1:
          navigate(`/admin/${userId}`);
          break;
        case 2:
          navigate(`/moderator/${userId}`);
          break;
        case 3:
          navigate(`/member/${userId}`);
          break;
        default:
          navigate('/');
          alert("Login Failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  return (
    <><Navbar />
    
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f7f7f7'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          width: '300px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>NutriSync Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }} />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }} />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>

        {/* {onmessage && (
      <p style={{ marginTop: '1rem', textAlign: 'center'}}>

      </p>
    )} */}
      </form>
    </div></>
  );
};

