import { useState, FormEvent, ChangeEvent } from 'react';
import './PostNews.css';
import { useNavigate } from 'react-router-dom';
import figure from '../assets/figure.webp';
import { CiSignpostR1 } from 'react-icons/ci';

export function PostNews() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'movies',
    userName: '',
    city: '', 
    country: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let url = 'http://localhost:3500/post';
      let body: any = formData; 

      if (formData.category === 'weather') {
        url = 'http://localhost:3500/weather';
        body = {
          city: formData.city,
          country: formData.country
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          category: 'movies',
          userName: '',
          city: '', 
          country: ''
        });
        setSuccessMessage('News created successfully!');
        setTimeout(() => {
          setSuccessMessage(null);
          if (formData.category === 'weather') {
            navigate('/weather');
          } else {
            navigate('/homepage');
          }
        }, 1000);
      } else {
        throw new Error('Failed to create news');
      }
    } catch (error) {
      setError('Error creating news');
      console.error('Error creating news:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="news-posting">
      <form className="post-news" onSubmit={handleSubmit}>
        <h1 className="post-h1">Post News Here!</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
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
        {formData.category === 'weather' && (
          <div>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
            />
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              required
            />
          </div>
        )}
        {formData.category !== 'weather' && (
          <div>
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
          </div>
        )}
        <button type="submit" className="review-btn">
        <CiSignpostR1 />
        </button>
      </form>
      <div className="image-container">
        <img src={figure} alt="post-here" style={{ width: '400px', height: 'auto' }} />
      </div>
    </div>
  );
}
