import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type ChartData = {
  date: string;
  count: number;
};

type PieData = {
  status: string;
  count: number;
};

export default function ModeratorHome() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [moderatorData, setModeratorData] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setModeratorData(data))
      .catch(err => console.error("Failed to fetch moderator info:", err));
  }, []);

  useEffect(() => {
    fetch('/api/chart/approved-recipes', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setChartData(data))
      .catch(err => console.error("Failed to fetch chart data:", err));
  }, []);

  useEffect(() => {
    fetch('/api/chart/approval-status', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setPieData(data))
      .catch(err => console.error("Failed to fetch pie chart data:", err));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    navigate('/login');
  };

  const PIE_COLORS = ['#34d399', '#f87171']; // Approved: green, Unapproved: red

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow border-b border-gray-200">
        <div className="text-2xl font-extrabold text-blue-700 tracking-tight">NutriSync</div>
        <div className="flex items-center gap-6">
          <div className="text-2xl font-extrabold text-blue-700 tracking-tight">Moderator</div>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Hello, {moderatorData?.name || 'Moderator'} 👋
        </h2>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Approved Recipes Per Day
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">Loading chart data...</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Approval Status Breakdown
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">Loading pie chart data...</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/moderator/ingredients"
            className="bg-blue-600 text-white py-3 px-4 rounded-md text-center hover:bg-blue-700 transition"
          >
            Manage Ingredients
          </Link>
          <Link
            to="/moderator/categories"
            className="bg-blue-600 text-white py-3 px-4 rounded-md text-center hover:bg-blue-700 transition"
          >
            Manage Categories
          </Link>
          <Link
            to="/moderator/recipes"
            className="bg-blue-600 text-white py-3 px-4 rounded-md text-center hover:bg-blue-700 transition"
          >
            View Unapproved Recipes
          </Link>
        </div>
      </div>
    </>
  );
}
