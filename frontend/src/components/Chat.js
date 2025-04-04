import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [connected, setConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMessages([]);
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() === '') return;
    
    // 添加用户消息到本地状态
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessageText('');
    setIsLoading(true);
    
    try {
      // 准备发送到API的消息
      const messages = [
        {
          role: 'user',
          content: messageText
        }
      ];
      
      // 获取token (如果有)
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // 如果用户已登录，添加认证头
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // API调用
      const response = await fetch('http://localhost:8081/api/chat/completions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(messages)
      });
      
      if (!response.ok) {
        throw new Error('API请求失败');
      }
      
      const data = await response.text();
      
      // 可能需要解析JSON或者处理特殊格式的响应
      let aiResponseText = data;
      try {
        // 尝试解析JSON响应，如果是JSON格式
        const jsonData = JSON.parse(data);
        if (jsonData.choices && jsonData.choices[0].message) {
          aiResponseText = jsonData.choices[0].message.content;
        }
      } catch (e) {
        // 如果不是JSON或者解析失败，使用原始响应文本
        console.log('非JSON响应或解析失败', e);
      }
      
      // 添加AI回复
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now() + 1,
        text: aiResponseText || '我收到了您的消息，但无法生成有效回复。',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }]);
      
    } catch (error) {
      console.error('调用AI服务出错:', error);
      // 显示错误消息
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now() + 1,
        text: '抱歉，我遇到了问题，无法回应。请稍后再试。',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>聊天助手Chat Assistant</h1>
        <div className="user-controls">
          {user ? (
            <>
              <span className="username">{user.username}</span>
              <Link to="/history" className="history-link">历史记录</Link>
              <button className="logout-button" onClick={handleLogout}>退出</button>
            </>
          ) : (
            <div className="auth-buttons">
              <button className="login-button" onClick={handleLoginClick}>登录</button>
              <button className="signup-button" onClick={handleRegisterClick}>注册</button>
            </div>
          )}
          <div className="connection-status">
            {connected ? <span className="status-connected">在线</span> : <span className="status-disconnected">离线</span>}
          </div>
        </div>
      </header>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            {!user ? 
              <div className="welcome-message">
                <p>开始一个新对话吧！</p>
                <p className="login-hint">登录后可以保存您的聊天记录</p>
              </div>
              :
              <div className="welcome-message">
                <p>还没有消息。开始一个新对话吧！</p>
                <Link to="/history" className="history-hint">查看您的历史对话</Link>
              </div>
            }
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`message ${message.sender === 'user' ? 'message-sent' : 'message-received'}`}>
              <div className="message-bubble">
                {message.text}
              </div>
              <div className="message-timestamp">{message.timestamp}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="message-input"
          placeholder="输入消息..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="send-button" disabled={isLoading || messageText.trim() === ''}>
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>
    </div>
  );
}

export default Chat; 