
import React, { useState } from 'react';
import ExpandingTextArea from './ExpandingTextarea';
import { containerStyle, panelStyle, separatorStyle } from './styles';
import { RedefineChallenge } from '../../../types/exercises';
import InfoIcon from '../InfoIcon';
import { useOutletContext } from 'react-router-dom';
import { BookOne } from '../../api/bookOneService';

interface RedefineChallengeOutletContext {
  bookOne: BookOne | null;
  onUpdateBookOne: (updatedBook: Partial<BookOne>) => void;
  loading: boolean;
  error: string | null;
}

const infotext = `Write a definition for the problem you have chosen. What exactly does it mean? Why is it a problem? What are the causes and consequences it implies?`;

const RedefineChallengeExercise: React.FC<{ readonly?: boolean }> = ({ readonly = false }) => {
  const { bookOne, onUpdateBookOne, loading, error } = useOutletContext<RedefineChallengeOutletContext>();

  const [answers, setAnswers] = useState<RedefineChallenge>({
    left: {
      title: 'Redefine the chosen challenge',
      description: 'Is the initial chosen challenge still the focus of your future vision? Or have you found another one that caught your interest? Here you can redefine the chosen challenge based on the information you learned in the game.',
      answer: bookOne?.exercises.redefineChallengeAnswer.left.answer || '',
    },
    right: {
      title: 'Challenge description',
      description: 'Describe your new chosen challenge.',
      answer: bookOne?.exercises.redefineChallengeAnswer.right.answer || '',
    },
  });

  const handleAnswerChange = (side: 'left' | 'right') => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [side]: {
        ...prevAnswers[side],
        answer: value,
      },
    }));

    if (bookOne) {
      const updatedBook = {
        ...bookOne,
        exercises: {
          ...bookOne.exercises,
          redefineChallengeAnswer: {
            ...bookOne.exercises.redefineChallengeAnswer,
            [side]: { answer: value },
          },
        },
      };

      onUpdateBookOne(updatedBook);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <InfoIcon infoText={infotext} />
        <h2>{answers.left.title}</h2>
        <p>{answers.left.description}</p>
        <ExpandingTextArea
          id="redefine-challenge-text-area-left"
          instructionText=""
          value={answers.left.answer}
          onChange={handleAnswerChange('left')}
          readonly={readonly}
        />
      </div>
      <div style={separatorStyle} />
      <div style={panelStyle}>
        <h2>{answers.right.title}</h2>
        <p>{answers.right.description}</p>
        <ExpandingTextArea
          id="redefine-challenge-text-area-right"
          instructionText=""
          value={answers.right.answer}
          onChange={handleAnswerChange('right')}
          rows={20}
          readonly={readonly}
        />
      </div>
    </div>
  );
};

export default RedefineChallengeExercise;
