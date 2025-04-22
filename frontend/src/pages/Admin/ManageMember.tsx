import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ManageMember: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [selectedUserIDs, setSelectedUserIDs] = useState<string[]>([]);

  const fetchMembers = async () => {
    try{
      const res = await fetch(`/api/admin/${id}/manage-member/`);
      const data = await res.json();
        if (data[0] != null){
          setMembers(data);
        }
    }catch(err) {
      alert('Failed to fetch members');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSelect = (userID: string) => {
    setSelectedUserIDs((prev) =>
      prev.includes(userID)
        ? prev.filter((id) => id !== userID)
        : [...prev, userID]
    );
  };

  const handleBulkAction = async (action: 'blacklist' | 'assign') => {
    await fetch(`/api/admin/${id}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: selectedUserIDs }),
    })
      .then((res) => res.json())
      .then(() => alert(`${action} action applied to: ${selectedUserIDs.join(', ')}`))
      .catch((err) => alert(`Failed to ${action} users: ${err}`));

    fetchMembers();
    setSelectedUserIDs([]);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow border-b border-gray-200">
        <div className="text-2xl font-extrabold text-blue-700">NutriSync</div>
        <div className="text-2xl font-extrabold text-blue-700">Admin</div>
      </nav>
      <div className="flex justify-start px-4 mt-4">
        <button
          onClick={() => navigate(`/admin/${id}`)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow"
        >
          ← Back to Home
        </button>
      </div>

      {/* Content */}
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🧑‍💻 Manage Members</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border w-12"></th>
                    <th className="px-4 py-2 border">User ID</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                  </tr>
                </thead>
                <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">No Members Found.</td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.userID} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 border text-center">
                        <input
                          type="checkbox"
                          checked={selectedUserIDs.includes(member.userID)}
                          onChange={() => handleSelect(member.userID)}
                        />
                      </td>
                      <td className="px-4 py-2 border">{member.userID}</td>
                      <td className="px-4 py-2 border">{member.name}</td>
                      <td className="px-4 py-2 border">{member.email}</td>
                    </tr>
                  )))}
                </tbody>
              </table>

              {/* Bulk Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={() => handleBulkAction('blacklist')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                  disabled={selectedUserIDs.length === 0}
                >
                  ❌ Blacklist Selected
                </button>
                <button
                  onClick={() => handleBulkAction('assign')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                  disabled={selectedUserIDs.length === 0}
                >
                  ✅ Assign as Moderators
                </button>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default ManageMember;
