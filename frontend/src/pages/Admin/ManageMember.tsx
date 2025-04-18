import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ManageMember: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ members , setmembers ] = React.useState<{
    map(arg0: (member: any) => React.JSX.Element): React.ReactNode;members: any 
} | null>(null);

  useEffect(() => {
    fetch(`/api/admin/${id}/manage-member/`)
      .then(res => res.json())
      .then(data => setmembers(data))
      .catch(err => console.error("Failed to fetch members data", err));
  }, []);
  
  if (members === null) return <div>Loading...</div>;

  return (
    <div className="p-6 w-full h-screen box-border">
      <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">User ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.userID} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{member.userID}</td>
              <td className="px-4 py-2 border">{member.name}</td>
              <td className="px-4 py-2 border">{member.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

        <div className="flex flex-col gap-6 justify-center">
          <button className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100">
            blacklist Selected Members
          </button>
          <button className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100">
            Assign As Moderator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageMember;
