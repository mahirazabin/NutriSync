import { useState, useEffect, ChangeEvent, FormEvent, JSX } from 'react';

interface Ingredient {
  ingredientID: number;
  name: string;
  calories: number;
  unit: string;
  moderatorID: number;
}

export default function ModIngredients(): JSX.Element {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [form, setForm] = useState({ name: '', calories: 0, unit: '', moderatorID: 123 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ingredients 
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/ingredients');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Ingredient[] = await res.json();
        setIngredients(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Handle form input
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'calories' || name === 'moderatorID' ? +value : value
    }));
  }

  // Submit new ingredient
  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    console.log('Submitting ingredient:', form);
    try {
      const res = await fetch('/api/ingredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }
      // Refresh list
      const listRes = await fetch('/api/ingredients');
      const data: Ingredient[] = await listRes.json();
      setIngredients(data);
      // Reset form
      setForm({ name: '', calories: 0, unit: '', moderatorID: form.moderatorID });
    } catch (err: any) {
      console.error('Add error:', err);
      setError(err.message);
    }
  }

  // Delete an ingredient
  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/ingredient/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setIngredients(prev => prev.filter(i => i.ingredientID !== id));
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message);
    }
  }

  if (loading) return <p>Loading ingredients...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Manage Ingredients</h2>
      <ul>
        {ingredients.map(i => (
          <li key={i.ingredientID} style={{ margin: '8px 0' }}>
            {i.name} ({i.calories} cal) <em>{i.unit}</em>
            <button style={{ marginLeft: 8 }} onClick={() => handleDelete(i.ingredientID)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} style={{ marginTop: 24 }}>
        <h3>Add Ingredient</h3>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="calories"
          type="number"
          placeholder="Calories"
          value={form.calories}
          onChange={handleChange}
          required
        />
        <input
          name="unit"
          placeholder="Unit"
          value={form.unit}
          onChange={handleChange}
        />
        <input
          name="moderatorID"
          type="number"
          value={form.moderatorID}
          onChange={handleChange}
          hidden
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}