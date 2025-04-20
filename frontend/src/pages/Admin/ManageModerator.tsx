import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ManageModerator: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [moderators, setModerators] = useState<any[]>([]);
  const [selectedUserIDs, setSelectedUserIDs] = useState<string[]>([]);

  const fetchModerator = () => {
    fetch(`/api/admin/${id}/manage-moderator/`)
      .then((res) => res.json())
      .then((data) => setModerators(data))
      .catch((err) =>
        console.error('Failed to fetch moderator data', err)
      );
  };

  useEffect(() => {
    fetchModerator();
  }, []);

  const handleSelect = (userID: string) => {
    setSelectedUserIDs((prevSelected) =>
      prevSelected.includes(userID)
        ? prevSelected.filter((id) => id !== userID)
        : [...prevSelected, userID]
    );
  };

  const handleBulkAction = async (
    action: 'blacklist' | 'unassign'
  ) => {
    await fetch(`/api/admin/${id}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: selectedUserIDs }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`${action} action applied to selected users`);
      })
      .catch(() => alert(`Failed to ${action} users`));
    fetchModerator();
    setSelectedUserIDs([]);
  };

  return (
    <>
      <nav className="flex items-center justify-start px-8 py-4 bg-white shadow border-b border-gray-200">
        <div className="text-2xl font-extrabold text-blue-700 tracking-tight">
          NutriSync
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Manage Moderators
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left border">Select</th>
                  <th className="px-4 py-2 text-left border">User ID</th>
                  <th className="px-4 py-2 text-left border">Name</th>
                  <th className="px-4 py-2 text-left border">Email</th>
                </tr>
              </thead>
              <tbody>
                {moderators.map((moderator) => (
                  <tr
                    key={moderator.userID}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2 border text-center">
                      <input
                        type="checkbox"
                        className="accent-blue-600 w-4 h-4"
                        checked={selectedUserIDs.includes(
                          moderator.userID
                        )}
                        onChange={() =>
                          handleSelect(moderator.userID)
                        }
                      />
                    </td>
                    <td className="px-4 py-2 border">{moderator.userID}</td>
                    <td className="px-4 py-2 border">{moderator.name}</td>
                    <td className="px-4 py-2 border">{moderator.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-end">
            <button
              onClick={() => handleBulkAction('unassign')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md disabled:opacity-50 transition"
              disabled={selectedUserIDs.length === 0}
            >
              Assign as Members
            </button>
            <button
              onClick={() => handleBulkAction('blacklist')}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md disabled:opacity-50 transition"
              disabled={selectedUserIDs.length === 0}
            >
              Ban Selected Moderators
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageModerator;
