import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import './SignUpPage.css';

interface SignUpData {
  email: string;
  password: string;
  name: string;
}
export const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    name: '',
  });
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3500/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        } else {
          throw new Error('Failed to create user');
        }
      }
  
      navigate('/signin'); 
      console.log('User created successfully');
    } catch (error: any) {
      setError(error.message);
    }
  };
  
  
  return (
    <div className="signup-container">
      <h2 className="title">Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="label">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
      <p className="signin-link">Already have an account? <Link to="/signin">Sign in here</Link></p>
    </div>
  );
};
