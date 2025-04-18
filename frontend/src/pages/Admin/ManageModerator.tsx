import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ManageModerator: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [ moderators , setModerators ] = React.useState<{
      map(arg0: (moderator: any) => React.JSX.Element): React.ReactNode;moderators: any 
  } | null>(null);
  
    useEffect(() => {
      fetch(`/api/admin/${id}/manage-moderator/`)
        .then(res => res.json())
        .then(data => setModerators(data))
        .catch(err => console.error("Failed to fetch moderator data", err));
    }, []);
    
    if (moderators === null) return <div>Loading...</div>;
  
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
            {moderators.map((moderator) => (
              <tr key={moderator.userID} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{moderator.userID}</td>
                <td className="px-4 py-2 border">{moderator.name}</td>
                <td className="px-4 py-2 border">{moderator.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
  

        <div className="flex flex-col gap-6 justify-center">
          <button className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100">
            blacklist Moderator
          </button>
          <button className="rounded-full border-2 px-6 py-3 text-sm font-medium hover:bg-gray-100">
            Unassign Moderator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageModerator;
