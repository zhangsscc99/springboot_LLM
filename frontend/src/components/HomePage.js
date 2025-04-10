import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [connected, setConnected] = React.useState(true);
  
  React.useEffect(() => {
    // 加载用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse user data', e);
        setUser(null);
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="logo-text">锦书</span>
          <span className="logo-ai">AI</span>
          <span className="logo-heart">❤️</span>
        </div>
        <div className="user-controls">
          {user ? (
            <>
              <span className="username">{user.username}</span>
              <Link to="/history" className="history-link">历史记录</Link>
              <button className="logout-button" onClick={handleLogout}>退出</button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">登录</Link>
              <Link to="/register" className="signup-button">注册</Link>
            </div>
          )}
          <div className="connection-status">
            {connected ? <span className="status-connected">在线</span> : <span className="status-disconnected">离线</span>}
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="hero-section">
          <h1 className="main-title">
            锦书情辞<br />
            让沟通更有魅力<br />
            <span>情感交流助手</span>
          </h1>
          <p className="subtitle">每一次对话，都是艺术；每一句情话，皆是真心。</p>
        </div>
        
        <div className="buttons-container">
          <div className="button-card reply-btn">
            <span className="button-icon">❤️</span>
            <span className="button-text">截图回复</span>
          </div>
          <div className="button-card reply-btn reply-manual" onClick={handleChatClick}>
            <span className="button-icon">✏️</span>
            <span className="button-text">文字输入</span>
          </div>
          <div className="button-card">
            <span className="button-icon">😘</span>
            <span className="button-text">搭讪话术</span>
          </div>
          <div className="button-card">
            <span className="button-icon">🥰</span>
            <span className="button-text">情话精选</span>
          </div>
          <div className="button-card">
            <span className="button-icon">📋</span>
            <span className="button-text">个人简介</span>
          </div>
          <div className="button-card">
            <span className="button-icon">🖼️</span>
            <span className="button-text">头像制作</span>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title">为什么选择锦书情辞？</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>智能对话</h3>
              <p>理解语境，创造自然流畅的对话体验</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>隐私保障</h3>
              <p>您的对话安全加密，私密性得到全面保障</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>迅速响应</h3>
              <p>即时获取恰到好处的回复建议</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 