import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Member {
    id: string;
    name: string;
    email: string;
    phoneno: number;
    password: string;
    access : string;
}

interface Recipe {
    id: string;
    name: string;
    servings: number;
    calories: number;
    approved: boolean;
    image: string;
}

const MemberHome: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<Member | null>(null);
    const [editedUser, setEditedUser] = useState<Member | null>(null);
    const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
    const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/member/${id}/profile`);
                const data = await res.json();
                setUser(data);
                setEditedUser(data);
            } catch (err) {
                alert('Failed to fetch user');
            }
        };

        const fetchUserRecipes = async () => {
            try {
                const res = await fetch(`/api/member/${id}/recipe`);
                const data = await res.json();
                setUserRecipes(data);
            } catch (err) {
                alert('Failed to fetch user recipes');
            }
        };

        const fetchUserLikedRecipes = async () => {
            try {
                const res = await fetch(`/api/member/${id}/liked`);
                const data = await res.json();
                setLikedRecipes(data);
            } catch (err) {
                alert('Failed to fetch liked recipes');
            }
        };

        fetchUser();
        fetchUserRecipes();
        fetchUserLikedRecipes();
    }, [id]);

if (!user) {
        return <div>Loading...</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedUser) {
            setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/member/${id}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedUser),
            });
            const updated = await res.json();
            setUser(updated);
            setEditedUser(updated);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Profile Information</h2>
            {editedUser && (
                <div style={{ maxWidth: '400px', marginBottom: '30px' }}>
                    <input
                        type="text"
                        name="Name"
                        value={editedUser.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Name"
                    />
                    <br />
                    <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Email"
                    />
                    <br />
                    <input
                        type="text"
                        name="phoneno"
                        value={editedUser.phoneno}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Phone Number"
                    />
                    <br />
                    <input
                        type="password"
                        name="password"
                        value={editedUser.password}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Password"
                    />
                    <br />
                    {isEditing ? (
                        <button onClick={handleSave}>Save</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                </div>
            )}

            <h3>Your Recipes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {userRecipes.map((recipe) => (
                    <div key={recipe.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                        <img src={recipe.image} alt={recipe.name} style={{ width: '100%' }} />
                        <h4>{recipe.name}</h4>
                        <p>Servings: {recipe.servings}</p>
                        <p>Calories: {recipe.calories}</p>
                        <p>Status: {recipe.approved ? 'Approved' : 'Pending'}</p>
                    </div>
                ))}
            </div>

            <h3>Liked Recipes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {likedRecipes.map((recipe) => (
                    <div key={recipe.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                        <img src={recipe.image} alt={recipe.name} style={{ width: '100%' }} />
                        <h4>{recipe.name}</h4>
                        <p>Servings: {recipe.servings}</p>
                        <p>Calories: {recipe.calories}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberHome;
