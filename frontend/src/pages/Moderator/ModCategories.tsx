import { useState, useEffect, ChangeEvent, FormEvent, JSX } from 'react';
import { useParams } from 'react-router-dom';

interface Category {
  categoryID: number;
  name: string;
  moderatorID: number;
}

export default function ModCategories(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', moderatorID: 123 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories 
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Handle form changes
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'moderatorID' ? +value : value
    }));
  }

  // Submit new category
  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }
      // Refresh
      const listRes = await fetch('/api/categories');
      const data: Category[] = await listRes.json();
      setCategories(data);
      setForm({ name: '', moderatorID: form.moderatorID });
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Delete category
  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/category/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setCategories(prev => prev.filter(c => c.categoryID !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{color:'red'}}>Error: {error}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Manage Categories</h2>
      <ul>
        {categories.map(c => (
          <li key={c.categoryID} style={{ margin: '8px 0' }}>
            {c.name}
            <button style={{ marginLeft: 8 }} onClick={() => handleDelete(c.categoryID)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} style={{ marginTop: 24 }}>
        <h3>Add Category</h3>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="moderatorID"
          type="number"
          value={form.moderatorID}
          hidden
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}