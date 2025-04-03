import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [connected, setConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          content: userMessage.text
        }
      ];
      
      // 简单的API调用
      const response = await fetch('http://localhost:8081/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Apple Chat</h1>
        <div className="connection-status">
          {connected ? <span className="status-connected">在线</span> : <span className="status-disconnected">离线</span>}
        </div>
      </header>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">还没有消息。开始一个新对话吧！</div>
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

export default App; 