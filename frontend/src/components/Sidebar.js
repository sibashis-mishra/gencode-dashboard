import React from 'react';
import { Menu, Layout } from 'antd';
import { UserOutlined, VideoCameraOutlined, UploadOutlined, FileTextOutlined, InboxOutlined, LogoutOutlined  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/default-monochrome.svg'
import { useAuth } from '../context/AuthContext';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout()
    
    // Redirect to login or home page
    navigate('/login'); // Adjust this route as necessary
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo" style={{ height: 64, margin: '16px', textAlign: 'center' }}>
        <img 
          src={logo} // Replace with your SVG file path
          alt="Logo" 
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        onClick={({ key }) => {
            if (key === 'logout') {
              handleLogout();
            } else {
              navigate(key);
            }
          }}
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
            key: '/page3',
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
