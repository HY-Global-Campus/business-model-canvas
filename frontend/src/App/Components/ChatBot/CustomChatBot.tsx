import React, { useState, useEffect, useRef, FormEvent } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Message, generateId, saveMessages, loadMessages } from './utils';
import './CustomChatBot.css';

interface CustomChatBotProps {
  onSendMessage: (message: string) => Promise<string>;
}

const CustomChatBot: React.FC<CustomChatBotProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const loaded = loadMessages();
    setMessages(loaded);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: generateId(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await onSendMessage(userMessage.text);
      
      const botMessage: Message = {
        id: generateId(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: generateId(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="custom-chatbot">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>👋 Hello! I'm your Business Model Canvas advisor. Ask me anything about your business model, and I'll help you refine your ideas.</p>
          </div>
        )}
        
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="message bot typing-message">
            <div className="avatar">🤖</div>
            <div className="content">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="input-container" onSubmit={handleSend}>
        <input
          type="text"
          className="message-input"
          placeholder="Ask me about your business model..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isTyping}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!inputValue.trim() || isTyping}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default CustomChatBot;

