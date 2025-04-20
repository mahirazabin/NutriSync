import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> |{' '}
      <Link to="/signup">Sign Up</Link> |{' '}
      <Link to="/login">Login</Link> |{' '}
      <Link to="/moderator">Moderator</Link>
    </nav>
  );
}
