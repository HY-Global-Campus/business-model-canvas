
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';
//import ChooseChallengeExercise from '../../Components/Exercise/ChooseChallenge';
//import IdentifyLeveragePointsExercise from '../../Components/Exercise/IdentifyLeveragePoints';
//import RedefineChallengeExercise from '../../Components/Exercise/RedefineChallenge';
//import ValuesExercise from '../../Components/Exercise/Values';
//import FromFutureToPresentExercise from '../../Components/Exercise/FromFutureToPresent';
import FuturePitchExercise from '../../Components/Exercise/FuturePitch';
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
      <FuturePitchExercise />
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

