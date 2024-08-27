import React from 'react';

interface MessageParserProps {
  children: React.JSX.Element;
  actions: Actions;
}

interface Actions {
    requestCompletionMessage: (message: string) => Promise<void>;
    newBotMessage: (message: string) => void;
}

const MessageParser = ({ children, actions }: MessageParserProps) => {
  const parse = async (message: string) => {
    await actions.requestCompletionMessage(message);

  } 

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;
