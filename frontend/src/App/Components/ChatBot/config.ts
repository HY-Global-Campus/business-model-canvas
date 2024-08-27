import { createChatBotMessage } from 'react-chatbot-kit';
const config = {
	initialMessages: [createChatBotMessage('Hello world')],
	botName: 'Madida',
	state: {
		gptChatHistory: [],
	}
};

export default config;
