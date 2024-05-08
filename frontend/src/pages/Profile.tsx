import { useEffect, useState } from 'react';
import "./Profile.css";
import { News } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { timeElapsed } from '../functions';
import { MdDelete, MdOutlineEdit } from 'react-icons/md';

export function Profile() {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPosts, setUserPosts] = useState<News[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:3500/user-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.username);
          setUserEmail(data.email);
        } else {
          throw new Error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    const fetchUserPosts = async () => {
      try {
        const response = await fetch('http://localhost:3500/user-posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data: News[] = await response.json();
          setUserPosts(data);
        } else {
          throw new Error('Failed to fetch user posts');
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserDetails();
    fetchUserPosts();
  }, []);

  const handleDeletePost = async (postId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3500/news/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setUserPosts(userPosts.filter(post => post.id !== postId));
        console.log('Post deleted successfully');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  const navigate = useNavigate()

  return (
    <>
      <div className="profile">
        <div className="profile-header">
          <img className="profile-img" src="https://static.vecteezy.com/system/resources/previews/005/129/844/original/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg" width="200px" alt="Profile" />
          <div className="email">
            <p className="welcome-text">Welcome, {userName}!</p>
            <p className="email-text">{userEmail}</p>
          </div>
        </div>
      </div>
      <div className='all-your-posts'>
        <h2 className='all-your-posts-h2'>All your posts are here!</h2>
        <ul className="user-posts-list">
          {userPosts.reverse().map((post) => (
            <li key={post.id} className="user-post-item">
              <Link to={`/news/${post.id}`} className="post-link">
                <img src={post.image_url} alt="News" className="NewsItemImage" />
                <h3 className="post-title">{post.title}</h3>
                <p className="post-category">Category: {post.category}</p>
                <p className="post-created">Created: {timeElapsed(post.created_at)}</p>
              </Link>
              <div className='actions-button'>
              <button className="edit-button" data-text="Edit" onClick={() => navigate(`/edit/${post.id}`)}><MdOutlineEdit /></button>
                <button className="delete-button" data-text="Delete" onClick={() => handleDeletePost(post.id)}><MdDelete /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
