import { error } from "console";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";

type OptionType = {
  label: string;
  value: string;
  ingredientID?: number;
  categoryID?: number;
};

type SelectedIngredientType = {
  ingredientID: number;
  name: string;
  quantity: number;
};

const CreateRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [allIngredients, setAllIngredients] = useState<OptionType[]>([]);
  const [allCategories, setAllCategories] = useState<OptionType[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredientType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);
  const [servingSize, setServingSize] = useState(0);
  const [description, setDescription] = useState("");
  const [imageURL, setImage] = useState("");
  const [message, setMessage] = useState("");

  const fetchIngredients = async () => {
    await fetch(`/api/member/${id}/ingredient`)
      .then(res => res.json())
      .then(data => {
        const options = data.map((ingredient: any) => ({
          label: ingredient.ingredientName,
          value: ingredient.ingredientName,
          ingredientID: ingredient.ingredientID,
        }));
        setAllIngredients(options);
      })
      .catch(err => console.error("Failed to fetch ingredients", err));
  };

  const fetchCategories = async () => {
    await fetch(`/api/member/${id}/category`)
      .then(res => res.json())
      .then(data => {
        const options = data.map((category: any) => ({
          label: category.categoryName,
          value: category.categoryName,
          categoryID: category.categoryID,
        }));
        setAllCategories(options);
      })
      .catch(err => console.error("Failed to fetch categories", err));
  };

  useEffect(() => {
    fetchIngredients();
    fetchCategories();
  }, []);

  const handleIngredientSelect = (selected: readonly OptionType[] | null) => {
    if (!selected) {
      setSelectedIngredients([]);
      return;
    }

    const updated = selected.map((option) => {
      const existing = selectedIngredients.find(i => i.ingredientID === option.ingredientID);
      return {
        ingredientID: option.ingredientID!,
        name: option.value,
        quantity: existing ? existing.quantity : 0,
      };
    });

    setSelectedIngredients(updated);
  };

  const updateQuantity = (ingredientID: number, quantity: number) => {
    setSelectedIngredients((prev) =>
      prev.map((ing) =>
        ing.ingredientID === ingredientID ? { ...ing, quantity } : ing
      )
    );
  };

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();

    const ingredientValues = selectedIngredients.map(i => ({
      id: i.ingredientID,
      quantity: i.quantity,
    }));

    const categoryValues = selectedCategories.map(c => ({
      id: c.categoryID!,
      name: c.value,
    }));

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
          ingredients: ingredientValues,
          categories: categoryValues,
          imageURL,
        }),
      });

      alert("Recipe created successfully!");
      fetchCategories();
      fetchIngredients();
    }catch (error) {
        alert("Failed to create recipe");
  };
}

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
          onChange={(e) => setDescription(e.target.value)}
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
          <span> {servingSize}</span>
        </div>

        <br /><br />

        <label>Ingredients</label>
        <Select
          isMulti
          options={allIngredients}
          onChange={handleIngredientSelect}
          getOptionLabel={(e) => e.label}
          getOptionValue={(e) => e.value}
          placeholder="Select Ingredients"
        />

        {selectedIngredients.map((ingredient) => (
          <div key={ingredient.ingredientID} style={{ marginTop: "0.5rem" }}>
            <span>{ingredient.name}</span>
            <input
              type="number"
              min="0"
              placeholder="Quantity (g)"
              value={ingredient.quantity}
              onChange={(e) =>
                updateQuantity(ingredient.ingredientID, parseInt(e.target.value, 10) || 0)
              }
              style={{ marginLeft: "1rem" }}
              required
            />
          </div>
        ))}

        <br /><br />

        <label>Categories</label>
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
