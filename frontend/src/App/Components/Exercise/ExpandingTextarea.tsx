
import React, { useState } from 'react';

type ExpandingTextAreaProps = {
  instructionText: string;
  id: string; // To associate the label with the textarea
};

const ExpandingTextArea: React.FC<ExpandingTextAreaProps> = ({ instructionText, id }) => {
  const [text, setText] = useState('');

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1em', // Space below the whole component
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: '0.5em', // Space between label and textarea
    // Add other styles as needed
  };

  const textAreaStyle: React.CSSProperties = {
    minHeight: '2em', // Height for two rows
    maxHeight: '10em', // Maximum height for 5 rows before scrolling
    overflowY: 'auto',
    resize: 'none',
    lineHeight: '1.5em',
    padding: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    width: '100%',
    borderRadius: '10px',
    margin: '10px 0px',
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div style={containerStyle}>
      <label htmlFor={id} style={labelStyle}>{instructionText}</label>
      <textarea
        id={id}
        style={textAreaStyle}
        value={text}
        onChange={handleChange}
        rows={2}
        placeholder='Type your answer here. Max. 50 words.'
      />
    </div>
  );
};

export default ExpandingTextArea;

