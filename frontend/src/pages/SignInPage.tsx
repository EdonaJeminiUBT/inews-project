import React, { useState } from 'react';
import './SignInPage.css';
import { Link, useNavigate } from 'react-router-dom';

interface SignInData {
  email: string;
  password: string;
}

export const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3500/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        navigate('/homepage');
      } else {
        const errorMessage = await response.text(); 
        throw new Error(errorMessage);
      }
    } catch (error:any) {
      console.error('Error signing in:', error);
      setError(error.message);
    }
  };
  
  

  return (
    <div className='signin-page'>
    <div className="container">
      <h2 className="title">Sign In</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder='Password'
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
    </div> 
  );
};
