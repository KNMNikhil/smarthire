import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SignInPage } from '../ui/sign-in';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Admin form data:', data);

    try {
      const response = await login(data, 'admin');
      console.log('Admin login successful:', response);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    alert('Admin password reset - Contact system administrator');
  };

  return (
    <SignInPage
      userType="admin"
      heroImageSrc="/REC1.avif"
      onSignIn={handleSubmit}
      onResetPassword={handleResetPassword}
    />
  );
};

export default AdminLogin;