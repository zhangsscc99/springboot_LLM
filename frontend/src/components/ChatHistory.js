import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/ChatHistory.css';

function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 检查用户是否已登录
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // 如果未登录，重定向到登录页面
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      // 获取聊天历史
      fetchChatHistory();
    } catch (e) {
      console.error('Failed to parse user data', e);
      navigate('/login');
    }
  }, [navigate]);

  const fetchChatHistory = async () => {
    setLoading(true);
    
    try {
      // 这里应该是API调用来获取聊天历史
      // 由于我们没有实现后端存储，这里模拟一些历史记录
      setTimeout(() => {
        const mockHistory = [
          { id: 'chat1', title: '关于Java编程的对话', timestamp: '2025-04-03 10:30', previewText: '如何开始学习Java编程？' },
          { id: 'chat2', title: '旅游计划讨论', timestamp: '2025-04-02 16:45', previewText: '我想计划一次欧洲旅行，有什么建议？' },
          { id: 'chat3', title: '健康饮食建议', timestamp: '2025-04-01 09:15', previewText: '我想改善我的饮食习惯，有什么建议？' },
          { id: 'chat4', title: '电影推荐', timestamp: '2025-03-30 20:10', previewText: '能推荐一些好看的科幻电影吗？' },
          { id: 'chat5', title: '学习Python', timestamp: '2025-03-28 14:25', previewText: 'Python和Java哪个更适合初学者？' }
        ];
        setChatHistory(mockHistory);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load chat history', error);
      setLoading(false);
    }
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    e.preventDefault();
    // 这里应该调用API删除聊天
    // 现在简单模拟删除操作
    setChatHistory(prevHistory => prevHistory.filter(chat => chat.id !== chatId));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="history-container">
      <header className="history-header">
        <h1>聊天历史</h1>
        <div className="user-info">
          {user && <span className="history-username">{user.username}</span>}
          <button className="history-logout-button" onClick={handleLogout}>退出</button>
          <Link to="/" className="back-to-chat">返回聊天</Link>
        </div>
      </header>

      <div className="history-content">
        {loading ? (
          <div className="history-loading">加载中...</div>
        ) : chatHistory.length === 0 ? (
          <div className="history-empty">
            <p>您还没有任何聊天记录</p>
            <Link to="/" className="start-chat-button">开始新对话</Link>
          </div>
        ) : (
          <ul className="history-list">
            {chatHistory.map(chat => (
              <li key={chat.id} className="history-item">
                <Link to={`/chat/${chat.id}`} className="history-link">
                  <div className="history-item-content">
                    <h3>{chat.title}</h3>
                    <p className="history-preview">{chat.previewText}</p>
                    <span className="history-timestamp">{chat.timestamp}</span>
                  </div>
                  <button 
                    className="history-delete-button"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                  >
                    删除
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ChatHistory; 