import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import '../styles/Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const API_URL = `${config.API_BASE_URL}/api/auth/register`;

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username || !password || !email || !fullName) {
      setError('请填写所有字段');
      return;
    }
    
    // 简单的密码验证
    if (password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }
    
    // 简单的邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // 准备请求数据
    const requestData = {
      username,
      password,
      email,
      fullName
    };
    
    try {
      console.log('正在发送注册请求到:', API_URL);
      console.log('请求数据:', JSON.stringify({ ...requestData, password: '***' }));
      
      // 发送请求
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('收到响应状态:', response.status);
      console.log('响应头:', [...response.headers.entries()]);
      
      const contentType = response.headers.get('content-type');
      console.log('响应内容类型:', contentType);
      
      // 判断内容类型
      const isJson = contentType && contentType.includes('application/json');
      
      // 处理错误响应
      if (!response.ok) {
        let responseText;
        let errorMessage;
        
        try {
          responseText = await response.text();
          console.log('错误响应内容:', responseText);
          
          if (isJson && responseText) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || '注册失败';
          } else {
            errorMessage = responseText || `服务器返回错误: ${response.status}`;
          }
        } catch (e) {
          errorMessage = `解析响应失败: ${e.message}`;
        }
        
        throw new Error(errorMessage);
      }
      
      // 处理成功响应
      let data;
      try {
        if (isJson) {
          const responseText = await response.text();
          console.log('成功响应内容:', responseText);
          data = responseText ? JSON.parse(responseText) : {};
        } else {
          data = await response.text();
        }
        console.log('注册成功，响应数据:', data);
      } catch (e) {
        console.error('解析响应失败:', e);
        throw new Error(`解析响应失败: ${e.message}`);
      }
      
      // 注册成功，跳转到登录界面
      alert('注册成功！请登录。');
      navigate('/login');
      
    } catch (error) {
      console.error('注册错误:', error);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        setError('无法连接到服务器，请确保后端服务正在运行并检查网络连接');
      } else {
        setError(error.message || '注册时发生错误');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>注册</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fullName">全名</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        
        <div className="auth-link">
          已有账号？ <span onClick={() => navigate('/login')}>登录</span>
        </div>
      </div>
    </div>
  );
};

export default Register; 