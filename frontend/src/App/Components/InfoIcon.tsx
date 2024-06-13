
import React, { useState } from 'react';

const infoIconStyle: React.CSSProperties = {
  cursor: 'pointer',
  display: 'inline-block',
  width: '24px',
  height: '24px',
  backgroundColor: '#007BFF',
  color: '#fff',
  borderRadius: '50%',
  fontSize: '16px',
  textAlign: 'center',
  lineHeight: '24px',
    position: 'relative',
    left: '5%',
    right: '5%'
};

const floatingWindowStyle: React.CSSProperties = {
  position: 'fixed',
  top: '30%',
  left: '30%',
  width: '200px',
  padding: '50px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  zIndex: 1000,
  color: 'black',  
  whiteSpace: 'pre-line',
  minWidth: '500px',
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
};

interface InfoIconProps {
  infoText: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ infoText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWindow = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={infoIconStyle} onClick={toggleWindow}>
        i
      </div>
      {isOpen && (
        <div style={floatingWindowStyle}>
          <button style={closeBtnStyle} onClick={toggleWindow}>×</button>
          <div>{infoText}</div>
        </div>
      )}
    </div>
  );
};

export default InfoIcon;
