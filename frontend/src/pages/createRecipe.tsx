import React, { useState } from "react";

const CreateRecipe: React.FC = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/members/recipes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, ingredients, instructions, category, image }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Success: ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Network error");
      console.error("Create recipe error:", err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>NutriSync Login</h2>
      <form onSubmit={handleCreateRecipe}>
        <input
          type="text"
          placeholder="Enter recipe name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Selection of ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Selection of categoRy"
          value={ingredients}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={ingredients}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Create</button>
      </form>
      {message && (
        <p style={{ marginTop: '1rem', color: message.includes('Success') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateRecipe;