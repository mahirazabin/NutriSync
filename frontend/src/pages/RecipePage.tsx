import { useState, useEffect, JSX } from 'react';
import { useParams } from 'react-router-dom';

interface Recipe {
  RecipeID:      number;
  Title:         string;
  Description:   string;
  TimeStamp:     string;
  Serving_Size:  number;
  TotalCalories: number;
  ImageURL?:     string;
}
interface Ingredient { ingredientID: number; name: string; calories: number; unit: string; }
interface Category   { categoryID: number; name: string; }

export default function RecipeDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe]         = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories]   = useState<Category[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

   // Like handler
  const handleLike = async (): Promise<void> => {
    const res = await fetch(`/api/recipe/${id}/like`, { method: 'POST' });
    if (!res.ok) alert('Error liking recipe');
    else alert('Liked!');
  };

  // Track handler
  const handleTrack = async (): Promise<void> => {
    const res = await fetch(`/api/recipe/${id}/track`, { method: 'POST' });
    if (!res.ok) alert('Error tracking');
    else alert('Calories added to tracker!');
  };

  useEffect(() => {
    async function load() {
      try {
        const [rRes, iRes, cRes] = await Promise.all([
          fetch(`/api/recipes/${id}`),
          fetch(`/api/recipe/${id}/ingredients`),
          fetch(`/api/recipe/${id}/categories`)
        ]);
        if (!rRes.ok) throw new Error('Recipe not found');
        const rData: Recipe       = await rRes.json();
        const iData: Ingredient[] = await iRes.json();
        const cData: Category[]   = await cRes.json();
        setRecipe(rData);
        setIngredients(iData);
        setCategories(cData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Loading recipe…</p>;
  if (error)   return <p style={{color:'red'}}>{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div style={{ padding: 16 }}>
      {recipe.ImageURL && <img src={recipe.ImageURL} alt={recipe.Title} style={{ width: '100%' }} />}
      <h2>{recipe.Title}</h2>
      <ul>
        <li><strong>Ingredients:</strong>
          <ul>{ingredients.map(i => <li key={i.ingredientID}>{i.name} ({i.calories} cal) [{i.unit}]</li>)}</ul>
        </li>
        <li><strong>Instructions:</strong><p>{recipe.Description}</p></li>
        <li><strong>Calorie Info:</strong> {recipe.TotalCalories} kcal</li>
        <li><strong>Category Tags:</strong> {categories.map(c => (<span key={c.categoryID}>{c.name} </span>))}</li>
      </ul>
      <button onClick={handleLike}>Like</button>
      <button style={{ marginLeft: 8 }} onClick={handleTrack}>Add to Tracker</button>
    </div>
  );
}