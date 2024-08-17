import React, { useState } from 'react';
import { Menu, Layout } from 'antd';
import { UserOutlined, FileTextOutlined, InboxOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/default-monochrome.svg';
import { useAuth } from '../context/AuthContext';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [quizId, setQuizId] = useState(0)

  const handleLogout = () => {
    logout();
    navigate('/login'); // Adjust this route as necessary
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key.startsWith('/submissions/')) {
      // Assuming the key for submissions is structured like "/submissions/quizId"
      const id = key.split('/submissions/')[1];
      setQuizId(id)
      navigate(`/submissions?quizId=${id}`);
    } else {
      navigate(key);
    }
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo" style={{ height: 64, margin: '16px', textAlign: 'center' }}>
        <img
          src={logo}
          alt="Logo"
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        onClick={handleMenuClick}
        items={[
          {
            key: '/',
            icon: <UserOutlined />,
            label: 'Home',
          },
          {
            key: '/quizzes',
            icon: <FileTextOutlined />,
            label: 'Quizzes',
          },
          {
            key: `/submissions?quizId=${quizId}`,
            icon: <InboxOutlined />,
            label: 'Submissions',
          },
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'LogOut',
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
