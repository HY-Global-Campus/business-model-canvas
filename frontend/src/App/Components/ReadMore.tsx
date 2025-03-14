import React, { useState } from 'react';

interface ReadMoreProps {
  children: React.ReactNode;
  limit?: number;
}

// Helper function to extract plain text from children recursively.
const extractText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return node.toString();
  } else if (Array.isArray(node)) {
    return node.map(extractText).join('');
  } else if (React.isValidElement(node)) {
    return extractText(node.props.children);
  }
  return '';
};

const ReadMore: React.FC<ReadMoreProps> = ({ children, limit = 300 }) => {
  const [expanded, setExpanded] = useState(false);
  const fullText = extractText(children);
  const shouldShowToggle = fullText.length > limit;

  // If the text is short, render the children as-is.
  if (!shouldShowToggle) {
    return <span>{children}</span>;
  }

  // Prepare the display text based on the expanded state.
  const displayText = expanded ? children : fullText.slice(0, limit) + '...';
  const toggleText = expanded ? 'Show Less' : 'Read More';

  return (
    <span>
      <span>{displayText}</span>
      <span
        onClick={() => setExpanded(prev => !prev)}
        style={{
          color: 'inherit',       // Removes the blue link color.
          cursor: 'pointer',
          marginLeft: '0.25em',
          textDecoration: 'underline' // Underlines the toggle text.
        }}
      >
        {toggleText}
      </span>
    </span>
  );
};

export default ReadMore;
