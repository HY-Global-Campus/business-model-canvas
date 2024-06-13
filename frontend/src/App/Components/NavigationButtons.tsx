import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationButtonsProps {
  pages: { path: string; label: string, color: string }[];
  currentPage: number;
}

 const navigationButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '24px',
  cursor: 'pointer',
  zIndex: '1000',
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ pages, currentPage }) => {
  const navigate = useNavigate();



  const goToPreviousPage = () => {
    if (currentPage > 0) {
      navigate(pages[currentPage - 1].path);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      navigate(pages[currentPage + 1].path);
    }
  };

  return (
    <div>
      {currentPage > 0 && (
        <div onClick={goToPreviousPage} style={{ ...navigationButtonStyle, left: '20px', color: pages[currentPage]?.color || 'black' }}>
          {'<'}
        </div>
      )}
      {currentPage < pages.length - 1 && (
        <div onClick={goToNextPage} style={{ ...navigationButtonStyle, right: '20px', color: pages[currentPage]?.color || 'black' }}>
          {'>'}
        </div>
      )}
    </div>
  );
};

export default NavigationButtons;
