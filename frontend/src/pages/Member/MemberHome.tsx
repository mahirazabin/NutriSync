import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';


const MemberHome: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userCalories, setUserCalories] = useState<number>(0);
  const [member, setMember] = useState<{Name : string , recipe: 0} | null>(null);

  const fetchUserCalories = async () => {
    try {
      const res = await fetch(`/api/member/${id}/calorie`);
      const data = await res.json();
      setUserCalories(data[0]);
    } catch (err) {
      alert('Failed to fetch user calories');
    }
  };

  const fetchMember = async () => {
    try {
      const res = await fetch(`/api/member/${id}`);
      const data = await res.json();
      setMember(data);
    } catch (err) {
      alert('Failed to fetch member');
    }
  };

  useEffect(() => {
    fetchUserCalories();
    fetchMember();
  }, []);

  if (member === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 border">
        <h2>
        Hello, {member.Name}
        </h2>
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
            <td>Recipes added till now</td>
            <td>{member.recipe}</td>
          </tr>
          <tr>
            <td>Tracker</td>
            <td>{userCalories}</td>
          </tr>
        </tbody>
      </table>

      <br /><br />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to={`/member/${id}/search/`}>
            Search Recipes
        </Link>

        <br /><br />

        <Link to={`/member/${id}/create/`}>
            Create Recipes
        </Link>

        <br /><br />

        <Link to={`/member/${id}/tracker/`}>
            Personal Tracker
        </Link>
      </div>
    </div>
  );
};

export default MemberHome;
