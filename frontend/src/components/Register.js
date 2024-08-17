import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/register.css'; // Import the CSS file

const Register = () => {
  const [error, setError] = useState('');
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to dashboard if already logged in
    }
  }, [user, navigate]);

  const handleRegister = async (values) => {
    try {
      const result = await register(values.name, values.email, values.password);
      if (result.success) {
        navigate('/'); // Redirect to dashboard on successful registration
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        {error && <Alert message={error} type="error" showIcon />}
        <Form name="register" onFinish={handleRegister}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item className="register-button-wrapper">
            <Button type="primary" htmlType="submit">Register</Button>
          </Form.Item>
          <Form.Item>
            Already have an account? <Link to="/login">Login</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
