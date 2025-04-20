import { useState, useEffect, JSX } from 'react';

interface Recipe {
  RecipeID: number;
  Title: string;
  Description: string;
}

export default function ModRecipes(): JSX.Element {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/recipes/pending')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Recipe[]) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching recipes:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleApprove = (recipeId: number): void => {
    fetch(`/api/recipe/${recipeId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved_mod_id: 1231233 }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Approval failed');
        setRecipes(prev => prev.filter(r => r.RecipeID !== recipeId));
      })
      .catch(err => console.error(err));
  };

  const handleReject = (recipeId: number): void => {
    fetch(`/api/recipe/${recipeId}/reject`, { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('Rejection failed');
        setRecipes(prev => prev.filter(r => r.RecipeID !== recipeId));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <p style={{ padding: 16 }}>Loading pending recipes…</p>;
  if (error)   return <p style={{ padding: 16, color: 'red' }}>Error: {error}</p>;
  if (recipes.length === 0) return <p style={{ padding: 16 }}>No pending recipes.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Pending Recipes</h2>
      {recipes.map(r => (
        <div key={r.RecipeID} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 8 }}>
          <h3>{r.Title}</h3>
          <p>{r.Description}</p>
          <button onClick={() => handleApprove(r.RecipeID)}>Approve</button>
          <button onClick={() => handleReject(r.RecipeID)} style={{ marginLeft: 8 }}>Reject</button>
        </div>
      ))}
    </div>
  );
}

