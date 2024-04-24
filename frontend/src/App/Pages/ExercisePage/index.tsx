
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';
import ValuesExercise from '../../Components/Exercise/Values';
import Header from '../../Components/Header';

const ExercisePage: React.FC = () => {
  const navigate = useNavigate();

  const pageStyle: CSSProperties = {
    padding: '0px 20px',
  };



  const navigationButtonStyle: CSSProperties = {
    cursor: 'pointer',
    padding: '10px 20px',
    fontSize: '36px',
    position: 'fixed',
    top: '50%',
  };

  return (
	<>
	<Header />
    <div style={pageStyle}>
      <ValuesExercise />
      <div onClick={() => navigate('/')} style={{ ...navigationButtonStyle, left: '20px' }}>
        {'<'}
      </div>
      <div onClick={() => navigate('/mindmap')} style={{ ...navigationButtonStyle, right: '20px' }}>
        {'>'}
      </div>
    </div>
    </>
  );
}

export default ExercisePage

