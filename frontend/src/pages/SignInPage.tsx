import React, { useState } from 'react';
import './SignInPage.css';
import { Link } from 'react-router-dom';

interface SignInData {
  email: string;
  password: string;
}

export const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const { token } = await response.json();
      // Store token in local storage or state for future use
      console.log('Token:', token);
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error occurred');
      }
      // Handle error, display message to user, etc.
    }
  };

  return (
    <div className="container">
      <h2 className="title">Sign In</h2>
      <form className="form" onSubmit={handleSubmit}>
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
        <button type="submit" className="signin-form-btn">Sign In</button>
        <p className="signup-link">Don't have an account? <Link to="/signup">Sign up here</Link></p>
      </form>
    </div>
  );
};
