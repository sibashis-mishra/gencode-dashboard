import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; // Import the CSS file

const Login = () => {
  const [error, setError] = useState('');
  const { login, user, loading } = useAuth(); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to home page if user is already logged in
    }
  }, [user, navigate]);

  const handleLogin = async (values) => {
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or use a loader component
  }

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        {error && <Alert message={error} type="error" showIcon />}
        <Form name="login" initialValues={{ remember: true }} onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item className="login-button-wrapper">
            <Button type="primary" htmlType="submit">Log in</Button>
          </Form.Item>
          <Form.Item>
            Don't have an account? <a href="/register">Register</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
