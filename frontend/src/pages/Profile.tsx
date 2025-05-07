import { useEffect, useState } from 'react';
import "./Profile.css"

export function Profile() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    fetch('http://localhost:3500/user-details', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserName(data.username); 
        setUserEmail(data.email);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }, []);

  return (
    <div className="profile">
      <div className="profile-header">
        <img className="profile-img" src="https://static.vecteezy.com/system/resources/previews/005/129/844/original/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg" width="200px" alt="Profile" />
        <div className="email">
          <p className="welcome-text">Welcome, {userName}!</p>
          <p className="email-text">Email: {userEmail}</p>
          
        </div>
      </div>
    </div>
  );
}
