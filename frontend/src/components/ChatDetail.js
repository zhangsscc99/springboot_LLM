import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../App.css';
import '../styles/ChatDetail.css';

function ChatDetail() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [connected, setConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [chatTitle, setChatTitle] = useState('');
  const messagesEndRef = useRef(null);
  const { chatId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 检查用户是否已登录
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      // 加载特定聊天的消息
      loadChatMessages();
    } catch (e) {
      console.error('Failed to parse user data', e);
      navigate('/login');
    }
    
    scrollToBottom();
  }, [chatId, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatMessages = async () => {
    setIsLoading(true);
    
    try {
      // 这里应该是API调用来获取特定聊天的消息
      // 由于我们没有实现后端存储，这里模拟一些消息
      setTimeout(() => {
        let mockMessages = [];
        let title = '';
        
        if (chatId === 'chat1') {
          title = '关于Java编程的对话';
          mockMessages = [
            { id: 1, text: '如何开始学习Java编程？', sender: 'user', timestamp: '10:30:15' },
            { id: 2, text: '学习Java编程可以从基础语法开始，然后逐步学习面向对象编程概念。我建议您先安装JDK和一个IDE如IntelliJ IDEA或Eclipse。之后，可以从简单的Hello World程序开始练习。', sender: 'ai', timestamp: '10:30:45' },
            { id: 3, text: '有哪些好的Java学习资源？', sender: 'user', timestamp: '10:31:20' },
            { id: 4, text: '有很多优质的Java学习资源：\n1. Oracle官方Java教程\n2. Codecademy的Java课程\n3. Coursera上的Java专业课程\n4. 《Java核心技术》和《Effective Java》等书籍\n5. Stack Overflow和GitHub上的开源项目', sender: 'ai', timestamp: '10:31:45' }
          ];
        } else if (chatId === 'chat2') {
          title = '旅游计划讨论';
          mockMessages = [
            { id: 1, text: '我想计划一次欧洲旅行，有什么建议？', sender: 'user', timestamp: '16:45:20' },
            { id: 2, text: '欧洲旅行是个很好的选择！您可以考虑先访问几个主要城市如巴黎、罗马、巴塞罗那或者柏林。提前规划行程，查看当地天气和季节性活动。别忘了检查签证要求和准备足够的欧元。', sender: 'ai', timestamp: '16:45:50' },
            { id: 3, text: '应该选择哪个季节去欧洲旅行？', sender: 'user', timestamp: '16:46:30' },
            { id: 4, text: '欧洲旅行的最佳时间通常是春季(4-5月)和秋季(9-10月)，这时候气温宜人且游客相对较少。夏季(6-8月)是旅游旺季，景点会很拥挤且价格较高。冬季则适合滑雪和圣诞市场，但北欧地区日照时间短。', sender: 'ai', timestamp: '16:47:00' }
          ];
        } else if (chatId === 'chat3') {
          title = '健康饮食建议';
          mockMessages = [
            { id: 1, text: '我想改善我的饮食习惯，有什么建议？', sender: 'user', timestamp: '09:15:10' },
            { id: 2, text: '健康饮食的关键是均衡和多样化。尝试增加蔬菜水果的摄入，减少加工食品和糖分，选择全谷物食品，控制食用油和盐的摄入量。每天保证足够的水分摄入，适量进食，定时进餐也很重要。', sender: 'ai', timestamp: '09:15:40' }
          ];
        } else {
          title = '聊天记录';
          mockMessages = [
            { id: 1, text: '这是一个新的聊天', sender: 'user', timestamp: '12:00:00' },
            { id: 2, text: '欢迎使用情感心理助手！我可以帮助你解答情感困惑、提供情感咨询，或者帮你想出吸引心仪对象的话术。请告诉我你遇到了什么情感问题？', sender: 'ai', timestamp: '12:00:15' }
          ];
        }
        
        setChatTitle(title);
        setMessages(mockMessages);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load chat messages', error);
      setIsLoading(false);
    }
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
    
    // 检测特定的身份询问问题并提供固定回答
    const identityQuestions = ["你是谁", "你是什么", "你叫什么", "你叫什么名字", "你的名字是什么", "介绍一下你自己", "你是哪个AI"];
    const lowerCaseMsg = messageText.toLowerCase();
    
    // 检查是否是在询问身份
    const isAskingIdentity = identityQuestions.some(q => lowerCaseMsg.includes(q));
    
    if (isAskingIdentity) {
      // 如果是询问身份，直接返回预设回答
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, {
          id: Date.now() + 1,
          text: "我是一个专业的情感心理助手，擅长解答用户的情感困惑、提供情感心理咨询。",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }
    
    try {
      // 准备发送到API的消息
      const messages = [
        {
          role: 'user',
          content: messageText
        }
      ];
      
      // 获取token
      const token = localStorage.getItem('token');
      
      // API调用
      const response = await fetch('http://localhost:8081/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleBackToHistory = () => {
    navigate('/history');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="chat-detail-header">
          <button className="back-button" onClick={handleBackToHistory}>
            ← 返回
          </button>
          <h1>{chatTitle}</h1>
        </div>
        <div className="user-controls">
          {user && <span className="username">{user.username}</span>}
          <button className="logout-button" onClick={handleLogout}>退出</button>
          <div className="connection-status">
            {connected ? <span className="status-connected">在线</span> : <span className="status-disconnected">离线</span>}
          </div>
        </div>
      </header>
      
      <div className="messages-container">
        {isLoading && messages.length === 0 ? (
          <div className="chat-loading">加载聊天记录中...</div>
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
          placeholder="继续对话..."
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

export default ChatDetail; 