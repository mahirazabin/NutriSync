import { useState, useEffect, ChangeEvent, JSX } from 'react';

interface Category { categoryID: number; name: string; }
interface Ingredient { ingredientID: number; name: string; }
interface RecipeCard { RecipeID: number; Title: string; Description: string; ImageURL?: string; }

export default function SearchRecipes(): JSX.Element {
  const [categories, setCategories]   = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedCategory, setSelectedCategory]   = useState<number | ''>('');
  const [selectedIngredient, setSelectedIngredient] = useState<number | ''>('');
  const [recipes, setRecipes]         = useState<RecipeCard[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // load filter options & initial recipes
    (async () => {
      const [catsRes, ingRes, recRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/ingredients'),
        fetch('/api/recipes/search')
      ]);
      const [cats, ings, recs] = await Promise.all([catsRes.json(), ingRes.json(), recRes.json()]);
      setCategories(cats);
      setIngredients(ings);
      setRecipes(recs);
      setLoading(false);
    })();
  }, []);

  // Refetch recipes on filter change
  useEffect(() => {
    (async () => {
      const params = new URLSearchParams();
      if (selectedCategory)   params.append('category_id', selectedCategory.toString());
      if (selectedIngredient) params.append('ingredient_id', selectedIngredient.toString());
      const res = await fetch('/api/recipes/search?' + params.toString());
      const data = await res.json();
      setRecipes(data);
    })();
  }, [selectedCategory, selectedIngredient]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Browse Recipes</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <select
          value={selectedCategory}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value ? +e.target.value : '')}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.categoryID} value={c.categoryID}>{c.name}</option>)}
        </select>
        <select
          value={selectedIngredient}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedIngredient(e.target.value ? +e.target.value : '')}
        >
          <option value="">All Ingredients</option>
          {ingredients.map(i => <option key={i.ingredientID} value={i.ingredientID}>{i.name}</option>)}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {recipes.map(r => (
          <div key={r.RecipeID} style={{ border: '1px solid #ccc', padding: 16 }}>
            {r.ImageURL && <img src={r.ImageURL} alt={r.Title} style={{ width: '100%', height: '120px', objectFit: 'cover' }}/>}            
            <h3>{r.Title}</h3>
            <p>{r.Description}</p>
            <a href={`/recipes/${r.RecipeID}`}>View Recipe</a>
          </div>
        ))}
      </div>
    </div>
  );
}