import React from 'react';
import '../pages.css';
import Header from '../../Components/Header';
import { courseCopy } from '../../../content/copy';
import '../../Components/Exercise/exercises.css';
import ShareCanvasLink from '../../Components/ShareCanvasLink';

const EndPage: React.FC = () => {
  const userId = sessionStorage.getItem('id');

  return (
    <div className="page-with-header">
      <Header />
      <div className="exercise-container">
        <div className="exercise-content">
          <div className="exercise-single-column">
            <div className="exercise-panel">
              <h2 className="exercise-title" style={{
                fontSize: '48px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#000',
              }}>
                Share your course canvas
              </h2>
              <p className="exercise-description" style={{
                fontSize: '20px',
                textAlign: 'center',
                color: '#000',
                marginBottom: '16px',
              }}>
                Share this view-only link
              </p>
              <ShareCanvasLink userId={userId} />
              <p className="exercise-description" style={{
                fontSize: '16px',
                textAlign: 'center',
                color: '#000',
                marginTop: '24px',
              }}>
                {courseCopy.endpage.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndPage;

