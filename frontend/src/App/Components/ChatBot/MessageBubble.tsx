import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, formatTime } from './utils';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div className={`message ${message.sender}`}>
      <div className="avatar">
        {message.sender === 'bot' ? '🤖' : '👤'}
      </div>
      <div className="content">
        <div className="text">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
        <span className="timestamp">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;

