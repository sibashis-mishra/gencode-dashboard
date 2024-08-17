import React, { useState, useEffect } from "react";
import { Menu, Layout } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  InboxOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/default-monochrome.svg";
import { useAuth } from "../context/AuthContext";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Adjust this route as necessary
  };

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    } else {
      navigate(key);
    }
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div
        className="logo"
        style={{ height: 64, margin: "16px", textAlign: "center" }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        onClick={handleMenuClick}
      >
        <Menu.Item key="/">
          <UserOutlined />
          <span style={{ marginLeft: "10px" }}>Home</span>
        </Menu.Item>
        <Menu.Item key="/quizzes">
          <FileTextOutlined />
          <span style={{ marginLeft: "10px" }}>Quizzes</span>
        </Menu.Item>
        <Menu.Item key={"/submissions"}>
          <InboxOutlined />
          <span style={{ marginLeft: "10px" }}>Submissions</span>
        </Menu.Item>
        <Menu.Item key="logout" onClick={handleLogout}>
          <LogoutOutlined />
          <span style={{ marginLeft: "10px" }}>LogOut</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
