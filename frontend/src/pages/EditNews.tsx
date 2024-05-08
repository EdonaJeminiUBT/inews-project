import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import figure from '../assets/figure.webp';
import './PostNews.css';

export function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3500/news/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        } else {
          throw new Error('Failed to fetch news');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNews(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3500/edit/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(news)
      });
      if (response.ok) {
        setSuccessMessage('News updated successfully');
        setTimeout(() => {
          navigate(`/news/${id}`);
        }, 1500);
      } else {
        throw new Error('Failed to update news');
      }
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  return (
    <div className="news-posting">
      <form className="post-news" onSubmit={handleSubmit}>
        <h1 className="post-h1">Edit News</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <input
          type="text"
          name="title"
          value={news.title}
          onChange={handleInputChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={news.description}
          onChange={handleInputChange}
          placeholder="Write your news here..."
          rows={7}
          required
        />
        <input
          type="url"
          name="imageUrl"
          value={news.imageUrl}
          onChange={handleInputChange}
          placeholder="Image URL"
          required
        />
        <select
          name="category"
          value={news.category}
          onChange={handleInputChange}
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
        <button type="submit" className="review-btn">
          UPDATE
        </button>
      </form>
      <div className="image-container">
        <img src={figure} alt="post-here" style={{ width: '400px', height: 'auto' }} />
      </div>
    </div>
  );
}
