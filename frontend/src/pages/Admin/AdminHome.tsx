import React from 'react';

const AdminHome: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Home Page</h2>

      {/* Greeting */}
      <div style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>
        Hello, <strong>Admin</strong>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '20px',
            border: '1px solid gray',
            cursor: 'pointer',
          }}
        >
          View All Moderators
        </button>
        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '20px',
            border: '1px solid gray',
            cursor: 'pointer',
          }}
        >
          View All Members
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
