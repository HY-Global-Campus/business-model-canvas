import CustomChatBot from './CustomChatBot';
import AISuggestionBanner from './AISuggestionBanner';
import { useBMCContext } from '../../contexts/BMCContext';
import { useAISuggestions } from '../../hooks/useAISuggestions';
import { getCompletion } from '../../api/chatbotService';
import { loadMessages } from './utils';

const ChatBot = () => {
  const { project, currentBlock } = useBMCContext();
  const { suggestion, isLoading, triggerSuggestion, dismissSuggestion } = useAISuggestions({
    project,
    currentBlock,
    enabled: true
  });

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      // Load existing message history
      const existingMessages = loadMessages();
      const messageHistory = existingMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // Add current message
      messageHistory.push({
        role: 'user',
        content: message
      });

      // Get completion with canvas context
      const response = await getCompletion({
        messages: messageHistory,
        canvasContext: project,
      });

      // Extract the message from the response
      if (response.choices && response.choices.length > 0) {
        const botMessages = response.choices[0].messages;
        if (botMessages && botMessages.length > 0) {
          return botMessages[botMessages.length - 1].content;
        }
      }

      return 'I apologize, but I received an unexpected response. Please try again.';
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw error;
    }
  };

  return (
    <>
      <AISuggestionBanner 
        suggestion={suggestion?.suggestion || null}
        onDismiss={dismissSuggestion}
        isLoading={isLoading}
      />
      
      <div style={{ width: '100%', height: '100%', position: 'relative', gridRow: 2 }}>
        <CustomChatBot onSendMessage={handleSendMessage} />

        <button 
          className="analyze-canvas-btn" 
          onClick={triggerSuggestion}
          disabled={isLoading}
          title="Get AI analysis of your canvas"
        >
          {isLoading ? '⏳' : '🔍'}
        </button>
      </div>
    </>
  );
};

export default ChatBot;

