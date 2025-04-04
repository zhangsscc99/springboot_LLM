import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import '../styles/Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const API_URL = `${config.API_BASE_URL}/api/auth/login`;
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('请填写所有字段');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('正在发送登录请求到:', API_URL);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      console.log('收到响应状态:', response.status);
      
      if (!response.ok) {
      const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
      
        let errorMessage;
        if (isJson) {
          const errorData = await response.json();
            errorMessage = errorData.message || '登录失败';
          } else {
          errorMessage = await response.text();
          }
        throw new Error(errorMessage || `服务器返回错误: ${response.status}`);
        }
        
      const data = await response.json();
      console.log('登录成功');
      
      // 保存Token到localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      }));
      
      // 登录成功，跳转到聊天界面
      navigate('/');
      
    } catch (error) {
      console.error('登录错误:', error);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        setError('无法连接到服务器，请确保后端服务正在运行并检查网络连接');
      } else {
        setError(error.message || '登录时发生错误');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>登录</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleLogin}>
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
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        
        <div className="auth-link">
          还没有账号？ <span onClick={() => navigate('/register')}>注册</span>
        </div>
      </div>
    </div>
  );
};

export default Login; 