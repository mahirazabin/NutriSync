import { useState, useEffect, JSX } from 'react';


interface User {
    UserID: number;
    UserName: string;
    Role: number;
  }

interface Recipe {
  RecipeID: number;
  Title: string;
  Description: string;
  TimeStamp: string;
  Serving_Size: number;
  TotalCalories: number;
  ImageURL?: string;
}

export default function MemberHome(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // 1) confirm we’re logged in
        const userRes = await fetch('/api/user');
        if (!userRes.ok) throw new Error('Not logged in');

        const userData: User = await userRes.json();
        console.log(userData);
        setUser(userData);


        // 2) fetch recipes created by this user.
        const res = await fetch('/api/user/recipes');
        if (!res.ok) throw new Error('Failed loading recipes');

        const data: Recipe[] = await res.json();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading your recipes…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Hello, {user?.UserName}</h2>
      <h3>Your Recipes:</h3>
      <ul>
        {recipes.map(r => (
          <li key={r.RecipeID}>
            <a href={`/recipes/${r.RecipeID}`}>{r.Title}</a>
          </li>
        ))}
      </ul>
      {recipes.length === 0 && <p>You haven’t added any recipes yet.</p>}
    </div>
  );
}
