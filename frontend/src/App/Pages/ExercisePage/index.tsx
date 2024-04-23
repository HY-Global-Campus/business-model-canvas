
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';

const ExercisePage: React.FC = () => {
  const navigate = useNavigate();

  // Styles
  const pageStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
  };

  const leftPanelStyle: CSSProperties = {
    flex: '1',
    marginRight: '10px',
  };

  const rightPanelStyle: CSSProperties = {
    flex: '1',
    marginLeft: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
  };

  const imageStyle: CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
  };

  const navigationButtonStyle: CSSProperties = {
    cursor: 'pointer',
    padding: '10px 20px',
    fontSize: '24px',
    position: 'fixed',
    bottom: '20px',
  };

  return (
    <div style={pageStyle}>
      <div style={leftPanelStyle}>
        {/* Content for left panel, like title and inputs */}
        <h1>Book of Serendip</h1>
        <div>
          <h2>Values</h2>
          <input type="text" style={inputStyle} placeholder="Value 1." />
          <input type="text" style={inputStyle} placeholder="Value 2." />
          <input type="text" style={inputStyle} placeholder="Value 3." />
        </div>
      </div>

      <div style={rightPanelStyle}>
        {/* Content for right panel, like image */}
        <h2>Tree of Values</h2>
        <img style={imageStyle} src="path-to-your-tree-image.png" alt="Tree of Values" />
      </div>

      <div onClick={() => navigate('/')} style={{ ...navigationButtonStyle, left: '20px' }}>
        {'<'}
      </div>
      <div onClick={() => navigate('/mindmap')} style={{ ...navigationButtonStyle, right: '20px' }}>
        {'>'}
      </div>
    </div>
  );
}

export default ExercisePage

