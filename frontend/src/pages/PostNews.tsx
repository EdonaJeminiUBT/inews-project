import { useState, FormEvent, ChangeEvent } from 'react';
import './PostNews.css';

export function PostNews() {
  const [formData, setFormData] = useState({
    title: '',
    description: '', 
    imageUrl: '', 
    category: 'movies',
    userName: ''
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3500/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('News created successfully');
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          category: 'movies', // Reset category to default
          userName: ''
        });
      } else {
        throw new Error('Failed to create news');
      }
    } catch (error) {
      console.error('Error creating news:', error);
      // Handle error
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="news-posting">
      <h1 className="post-h1">Post News</h1>
      <form className="post-news" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write your news here..."
          rows={7}
          required
        />
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="movies">Movies</option>
          <option value="celebrities">Celebrities</option>
          <option value="books">Books</option>
          <option value="general">General</option>
          <option value="politics">Politics</option>
          <option value="social_media">Social Media</option>
          <option value="weather">Weather</option>
        </select>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Your name"
        />
        <button type="submit" className="review-btn">
          POST
        </button>
      </form>
    </div>
  );
}
