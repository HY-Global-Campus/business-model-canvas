import React from 'react';
import Header from '../../Components/Header';
import { courseCopy } from '../../../content/copy';
import '../pages.css';

const Part1Page: React.FC = () => {
  return (
    <div className="page-with-header">
      <Header />
      <div className="exercise-container">
        <div className="exercise-content">
          <div className="exercise-single-column">
            <div className="exercise-panel">
              <h2 className="exercise-title" style={{ fontSize: '48px', marginBottom: '20px' }}>
                {courseCopy.part1.title}
              </h2>
              <p className="exercise-description" style={{ fontSize: '20px' }}>
                {courseCopy.part1.instruction}
              </p>
              {courseCopy.part1.peerReviewCriteria?.length ? (
                <>
                  <h3 className="exercise-subtitle" style={{ fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>
                    Part 1 peer review criteria:
                  </h3>
                  <ul className="exercise-list" style={{ fontSize: '18px', paddingLeft: '24px' }}>
                    {courseCopy.part1.peerReviewCriteria.map((criterion, i) => (
                      <li key={i}>{criterion}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Part1Page;
