
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! 👋 Welcome to Community Connect. How can I help you today?'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const userMessage = message.trim();

    if (!userMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMessage }
    ]);

    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/chatbot/',
        { message: userMessage }
      );

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: response.data.response }
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, something went wrong. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">

      {isOpen && (
        <div className="chatbot-window">

          <div className="chatbot-header">
            <div>
              <h5>Community Connect</h5>
              <span>AI Assistant • Online</span>
            </div>

            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender}`}
              >
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message bot">
                <div className="message-bubble typing">
                  Typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          <form className="chatbot-input" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />

            <button type="submit" disabled={loading || !message.trim()}>
              ➤
            </button>
          </form>

        </div>
      )}

      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chatbot"
      >
        {isOpen ? '×' : '💬'}
      </button>

    </div>
  );
}

export default Chatbot;
