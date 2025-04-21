import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Member {
  id: string;
  name: string;
  email: string;
  phoneno: number;
  password: string;
  access: string;
}

interface Recipe {
  id: string;
  name: string;
  servings: number;
  calories: number;
  approved: boolean;
  image: string;
}

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Member | null>(null);
  const [editedUser, setEditedUser] = useState<Member | null>(null);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/member/${id}/profile`);
      const data = await res.json();
      setUser(data);
      setEditedUser(data);
    };

    const fetchUserRecipes = async () => {
      const res = await fetch(`/api/member/${id}/recipe`);
      const data = await res.json();
      setUserRecipes(data);
    };

    const fetchUserLikedRecipes = async () => {
      const res = await fetch(`/api/member/${id}/liked`);
      const data = await res.json();
      setLikedRecipes(data);
    };

    fetchUser();
    fetchUserRecipes();
    fetchUserLikedRecipes();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`/api/member/${id}/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });
      setUser(editedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch {
      alert('Failed to update profile');
    }
  };

  if (!user || !editedUser) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow border-b border-gray-200">
        <div className="text-2xl font-extrabold text-blue-700 tracking-tight">NutriSync</div>
        <div className="text-2xl font-extrabold text-blue-700 tracking-tight">Member</div>
      </nav>
      <div className="flex justify-start px-4 mt-4">
      <button
      onClick={() => navigate(`/member/${id}`)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
    >
      ← Back to Dashboard
    </button>
      </div>

      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* 📄 Profile Section */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 Profile Info</h2>

            <div className="space-y-4">
              <input type="text" name="name" value={editedUser.name} onChange={handleChange} disabled={!isEditing}
                className="w-full px-4 py-2 border rounded" placeholder="Name" />
              <input type="email" name="email" value={editedUser.email} onChange={handleChange} disabled={!isEditing}
                className="w-full px-4 py-2 border rounded" placeholder="Email" />
              <input type="text" name="phoneno" value={editedUser.phoneno} onChange={handleChange} disabled={!isEditing}
                className="w-full px-4 py-2 border rounded" placeholder="Phone Number" />
              <input type="password" name="password" value={editedUser.password} onChange={handleChange} disabled={!isEditing}
                className="w-full px-4 py-2 border rounded" placeholder="Password" />

              {isEditing ? (
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Save Changes
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* 🍲 Your Recipes */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">📚 Your Recipes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userRecipes.map((r) => (
                <div key={r.id} className="border rounded-lg overflow-hidden shadow-sm">
                  <img src={r.image} alt={r.name} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h4 className="font-bold text-lg">{r.name}</h4>
                    <p>Servings: {r.servings}</p>
                    <p>Calories: {r.calories}</p>
                    <p>Status: <span className={r.approved ? 'text-green-600' : 'text-yellow-600'}>{r.approved ? 'Approved' : 'Pending'}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ❤️ Liked Recipes */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">❤️ Liked Recipes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {likedRecipes.map((r) => (
                <div key={r.id} className="border rounded-lg overflow-hidden shadow-sm">
                  <img src={r.image} alt={r.name} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h4 className="font-bold text-lg">{r.name}</h4>
                    <p>Servings: {r.servings}</p>
                    <p>Calories: {r.calories}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberProfile;
