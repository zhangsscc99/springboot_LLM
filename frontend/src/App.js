import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import ChatHistory from './components/ChatHistory';
import ChatDetail from './components/ChatDetail';
import './App.css';

// 检查用户是否已认证
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
      <Routes>
        {/* 首页 - 聊天页面(不需要登录) */}
        <Route path="/" element={<Chat />} />
        
        {/* 登录页面 */}
        <Route path="/login" element={<Login />} />
        
        {/* 注册页面 */}
        <Route path="/register" element={<Register />} />
        
        {/* 聊天历史(需要登录) */}
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <ChatHistory />
            </ProtectedRoute>
          } 
        />
        
        {/* 特定聊天详情(需要登录) */}
        <Route 
          path="/chat/:chatId" 
          element={
            <ProtectedRoute>
              <ChatDetail />
            </ProtectedRoute>
          } 
        />
      </Routes>
  );
}

export default App; 