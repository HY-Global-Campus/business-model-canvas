

import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import config from './config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import './styles.css' 

const ChatBot = () => {
  return (
    <div className="chatbot-host">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
};

export default ChatBot;

