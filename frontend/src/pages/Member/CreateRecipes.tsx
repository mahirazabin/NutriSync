import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";

type OptionType = {
  label: string;
  value: string;
};

const CreateRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [allIngredients, setAllIngredients] = useState<OptionType[]>([]);
  const [allCategories, setAllCategories] = useState<OptionType[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<OptionType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);
  const [servingSize, setServingSize] = useState(0);
  const [description, setDescription] = useState("");
  const [imageURL, setImage] = useState("");
  const [message, setMessage] = useState("");

const fetchIngredients = () => {
  fetch(`/api/member/${id}/ingredient`)
    .then(res => res.json())
    .then(data => {
      const options = data.map((ingredient: string) => ({
        label: ingredient,
        value: ingredient,
      }));
      setAllIngredients(options);
    })
    .catch(err => console.error("Failed to fetch ingredients", err));
};
  

const fetchCategories = () => {
  fetch(`/api/member/${id}/category`)
    .then(res => res.json())
    .then(data => {
      const options = data.map((category: string) => ({
        label: category,
        value: category,
      }));
      setAllCategories(options);
    })
    .catch(err => console.error("Failed to fetch categories", err));
};

useEffect(() => {
    fetchIngredients();
    fetchCategories();
  }, []);

  const handleCreateRecipe = async (e: React.FormEvent) => {

    const ingredientValues = selectedIngredients.map(i => i.value);
    const categoryValues = selectedCategories.map(c => c.value);

    try {
      const response = await fetch(`/api/member/${id}/add-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          servingSize,
          ingredient: ingredientValues,
          category: categoryValues,
          imageURL,
        }),
      });
      
      fetchCategories();
      fetchIngredients();

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Success: ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage("Unexpected error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create a Recipe</h2>
      <form onSubmit={handleCreateRecipe}>
        <input
          type="text"
          placeholder="Recipe Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Recipe Description"
          value={description}
          onChange={(e) => 
            setDescription(e.target.value)}
          required
        />

        <br /><br />

        <div>
          <label>Serving Size</label>
          <input
            type="range"
            min="1"
            max="10"
            value={servingSize}
            onChange={(e) => setServingSize(parseInt(e.target.value, 10))}
            required
          />
          <span>{servingSize}</span>
        </div>

        <br /><br />

        <Select
          isMulti
          options={allIngredients}
          value={selectedIngredients}
          onChange={(selected: readonly OptionType[] | null) =>
            setSelectedIngredients(selected ? [...selected] : [])
          }
          placeholder="Select Ingredients"
        />

        <br /><br />        
        
        <Select
          isMulti
          options={allCategories}
          value={selectedCategories}
          onChange={(selected: readonly OptionType[] | null) =>
            setSelectedCategories(selected ? [...selected] : [])
          }
          placeholder="Select Categories"
        />

        <br /><br />
        
        <input
          type="url"
          placeholder="http://URL-of-image"
          value={imageURL}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Create</button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", color: message.includes("Success") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateRecipe;
