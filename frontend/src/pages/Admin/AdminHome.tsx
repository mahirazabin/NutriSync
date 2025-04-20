import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const AdminHome: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ adminData , setAdminData ] = React.useState<{adminName: string, analytics: any } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/${id}`)
      .then(res => res.json())
      .then(data => setAdminData(data))
      .catch(err => console.error("Failed to fetch admin data", err));
  }, [id]);

  if (!adminData) return <div>Loading...</div>;
  
  if (adminData.adminName === "None"){
    return <div>Admin not found</div>;
  }
    

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Home Page</h2>

      {/* Greeting */}
      <div style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>
        Hello, <strong>{adminData.adminName}</strong>
      </div>

      <table >
        <thead>
          <tr>
            <th>Analytics</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>No. of new recipies in past 30 days</td>
            <td>{adminData.analytics["recipes"]}</td>
          </tr>
          <tr>
            <td>total ingredients</td>
            <td>{adminData.analytics["ingredients"]}</td>
          </tr>
          <tr>
            <td>total categories</td>
            <td>{adminData.analytics["categories"]}</td>
          </tr>
          <tr>
            <td>total users</td>
            <td>{adminData.analytics["users"]}</td>
          </tr>
        </tbody>
      </table>


      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Link to={`/admin/${id}/manage-moderator`}>
          View All Moderators
        </Link>
      <Link to={`/admin/${id}/manage-member`}>
          View All Members
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
