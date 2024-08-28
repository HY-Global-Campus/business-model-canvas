import { createChatBotMessage } from 'react-chatbot-kit';
const config = {
	initialMessages: [createChatBotMessage(`Hello! I am Madida and I here to help you.`, {})],
	botName: 'Madida',
	state: {
		gptChatHistory: [],
	}
};

export default config;
