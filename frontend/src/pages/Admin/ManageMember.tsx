import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ManageMember: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [members, setMembers] = useState<any[]>([]);
  const [selectedUserIDs, setSelectedUserIDs] = useState<string[]>([]);

  const fetchMembers = () => {
    fetch(`/api/admin/${id}/manage-member/`)
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Failed to fetch members data", err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSelect = (userID: string) => {
    setSelectedUserIDs((prevSelected) =>
      prevSelected.includes(userID)
        ? prevSelected.filter(id => id !== userID)
        : [...prevSelected, userID]
    );
  };

  const handleBulkAction = async (action: 'blacklist' | 'assign') => {

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
      .catch((err) => alert(`Failed to ${action} users ${err}`));

      fetchMembers();
      setSelectedUserIDs([]);
  };

  if (members.length === 0) return <div>Loading...</div>;

  return (
    <div className="p-6 w-full h-screen box-border">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border"></th> {/* checkbox column */}
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.userID} className="hover:bg-gray-50">
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
            ))}
          </tbody>
        </table>

        <div className="flex flex-col gap-6 justify-center mt-6">
          <button
            onClick={() => handleBulkAction('blacklist')}
            className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100"
            disabled={selectedUserIDs.length === 0}
          >
            Blacklist Selected Members
          </button>
          <button
            onClick={() => handleBulkAction('assign')}
            className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100"
            disabled={selectedUserIDs.length === 0}
          >
            Assign As Moderator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageMember;
