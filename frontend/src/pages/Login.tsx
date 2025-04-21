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
    <>
      <Navbar />

      <div
          className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-gray-100"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1605902711622-cfb43c4437d2?auto=format&fit=crop&w=1920&q=80')",
          }}
        >

        <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-lg max-w-md w-full p-8">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Login to NutriSync</h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-100 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">Sign up here</a>
          </p>
        </div>
      </div>
    </>
  );
}
