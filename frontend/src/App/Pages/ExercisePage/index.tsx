
import React from 'react';
import { CSSProperties } from 'react';
import Header from '../../Components/Header';
import { Outlet, useLocation } from 'react-router-dom';

const ExercisePage: React.FC = () => {
  const location = useLocation();
  const exerciseComponent = location.state?.exerciseComponent;

  const pageStyle: CSSProperties = {
    padding: '0px 20px',
  };



  return (
	<>
	<Header />
    <div style={pageStyle}>
        {exerciseComponent ? React.createElement(exerciseComponent) : <Outlet />}
    </div>
    </>
  );
}

export default ExercisePage

