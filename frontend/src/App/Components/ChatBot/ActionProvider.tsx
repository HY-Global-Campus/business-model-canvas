import React from 'react';
import * as chatbotService from './../../api/chatbotService';

interface ActionProviderProps {
    createChatBotMessage: (message: string) => void;
    setState: React.Dispatch<React.SetStateAction<StateType>>;
    children: React.JSX.Element;
    state: StateType;
}

interface StateType {
    messages: object[]
    gptChatHistory: chatbotService.Message[]
}

const ActionProvider = ({ createChatBotMessage, setState, state, children }: ActionProviderProps) => {

    const newBotMessage = (message: string) => {
        const botMessage = createChatBotMessage(message);
        if (botMessage !== undefined) {
        setState((prev) => ({...prev, messages: [...prev.messages, botMessage], }));   
        }
    }

    const requestCompletionMessage = async (message: string )=> {
        const newMessage: chatbotService.Message = {
            content: message,
            role: 'user'
        }
        const response =  await chatbotService.getCompletion({messages: [...state.gptChatHistory, newMessage]});
        const botMessage = createChatBotMessage(response.choices[0].messages[0].content);
        if (botMessage == undefined) {
            return;
        }
        const botMessageForHistory: chatbotService.Message = {
            content: response.choices[0].messages[0].content,
            role: 'assistant'
        }
        setState((prev) => ({...prev, messages: [...prev.messages, botMessage!], gptChatHistory: [...prev.gptChatHistory, newMessage, botMessageForHistory]}));

    }
    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    actions: {
                        newBotMessage,
                        requestCompletionMessage
                    },
                });
            })}
        </div>
    );
};

export default ActionProvider;
