// src/components/DashboardLayout.js
import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import Sidebar from './Sidebar';
import AppHeader from './Header';
import Home from './Home';
import Page2 from './Page2';
import Page3 from './Page3';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { user, loading } = useAuth();

  if (loading) {
    // Optionally, you can return a loading spinner or placeholder here
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout style={{ display: 'flex', flexDirection: 'column' }}>
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            flex: 1,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page2" element={<Page2 />} />
            <Route path="/page3" element={<Page3 />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
