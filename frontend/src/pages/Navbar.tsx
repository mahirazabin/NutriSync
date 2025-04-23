import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
      <div className="text-2xl font-extrabold text-blue-700 tracking-tight">
        NutriSync
      </div>

      <div className="flex space-x-4">
        <Link
          to="/"
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
        >
          Home
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
