import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ManageModerator: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [moderators, setModerators] = useState<any[]>([]);
  const [selectedUserIDs, setSelectedUserIDs] = useState<string[]>([]);
  
  const fetchModerator = () => {
    fetch(`/api/admin/${id}/manage-moderator/`)
      .then(res => res.json())
      .then(data => setModerators(data))
      .catch(err => console.error("Failed to fetch moderator data", err));
  };

  useEffect(() => {
      fetchModerator();
  }, []);

  const handleSelect = (userID: string) => {
    setSelectedUserIDs((prevSelected) =>
      prevSelected.includes(userID)
        ? prevSelected.filter(id => id !== userID)
        : [...prevSelected, userID]
    );
  };
    
  const handleBulkAction = async (action: 'blacklist' | 'unassign') => {
    await fetch(`/api/admin/${id}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_ids: selectedUserIDs }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`${action} action applied successfully ${selectedUserIDs}!`);
      })
      .catch((err) => alert(`Failed to ${action} users`));
      fetchModerator();
      setSelectedUserIDs([]);
  };

  if (moderators === null) return <div>Loading...</div>;
  
  return (
    <div className="p-6 w-full h-screen box-border">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border"></th>
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {moderators.map((moderator) => (
              <tr key={moderator.userID} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedUserIDs.includes(moderator.userID)}
                    onChange={() => handleSelect(moderator.userID)}
                  />
                </td>
                <td className="px-4 py-2 border">{moderator.userID}</td>
                <td className="px-4 py-2 border">{moderator.name}</td>
                <td className="px-4 py-2 border">{moderator.email}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col gap-6 justify-center mt-6">
          <button
            onClick={() => handleBulkAction('blacklist')}
            className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100"
            disabled={selectedUserIDs.length === 0}
          >
            Ban Selected Moderators
          </button>
          <button
            onClick={() => handleBulkAction('unassign')}
            className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100"
            disabled={selectedUserIDs.length === 0}
          >
            Assign As Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageModerator;
