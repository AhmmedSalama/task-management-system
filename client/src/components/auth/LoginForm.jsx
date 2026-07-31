"use client";

import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      
      <Input 
        label="Email Address" 
        type="email" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
        required 
      />
      
      <Input 
        label="Password" 
        type="password" 
        name="password" 
        value={formData.password} 
        onChange={handleChange} 
        required 
      />
      
      <Button type="submit" className="w-full mt-2" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;