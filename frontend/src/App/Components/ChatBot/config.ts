import { createChatBotMessage } from 'react-chatbot-kit';
const config = {
	initialMessages: [createChatBotMessage('Hello! I am Madida, your personal assistant.')],
	botName: 'Madida',
	state: {
		gptChatHistory: [],
	}
};

export default config;
