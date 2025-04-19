import { Link } from 'react-router-dom';
export default function ModeratorHome() {
  const mockChartData = [];

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Hello, Moderator</h2>
      <div style={{ margin: '1rem 0', padding: '1rem', background: '#eee' }}>
        {/* Chart placeholder */}
        <p>Chart showing recipes approved in the past</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/moderator/ingredients">Manage Ingredients</Link>
        <Link to="/moderator/categories">Manage Categories</Link>
        <Link to="/moderator/recipes">View Unapproved Recipes</Link>
      </div>
    </div>
  );
}