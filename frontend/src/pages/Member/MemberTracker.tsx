import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Recipe {
  id: string;
  name: string;
  calories: number;
}

const MemberTracker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    fetchRecipes();
    fetchUserCalories();
  }, [id]);

  const fetchRecipes = async () => {
    try {
      const res = await fetch(`/api/member/${id}/tracker/recipe`);
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      alert('Failed to fetch recipes');
    }
  };

  const fetchUserCalories = async () => {
    try {
      const res = await fetch(`/api/member/${id}/calorie`);
      const data = await res.json();
      setTotalCalories(data[0]);
    } catch (err) {
      alert('Failed to fetch user calories');
    }
  };

  const handleRemoveRecipe = async (recipeId: string) => {
    const confirmed = window.confirm("Are you sure you want to remove this recipe?");
    if (!confirmed) return;

    try {
      await fetch(`/api/member/${id}/tracker/delete/${recipeId}`, {
        method: 'DELETE',
      });
      await fetchRecipes();
      await fetchUserCalories();
    } catch (err) {
      alert('Failed to remove recipe');
    }
  };

  return (
    <div>
      <h2>Recipe Tracker</h2>
      <h4>Total Calories Consumed: {totalCalories}</h4>

      <table>
        <thead>
          <tr>
            <th>Recipe</th>
            <th>Calories</th>
            <th>Modification</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.name}</td>
              <td>{recipe.calories}</td>
              <td>
                <button onClick={() => handleRemoveRecipe(recipe.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTracker;
