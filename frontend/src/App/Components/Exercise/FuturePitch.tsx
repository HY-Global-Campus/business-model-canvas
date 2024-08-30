
import React, { useState } from 'react';
import ExpandingTextArea from './ExpandingTextarea';
import { containerStyle, panelStyle, separatorStyle } from './styles';
import { FuturePitch } from '../../../types/exercises';
import InfoIcon from '../InfoIcon';
import ChatBot from '../ChatBot';
import { useOutletContext } from 'react-router-dom';
import { BookOne } from '../../api/bookOneService';

interface FuturePitchOutletContext {
  bookOne: BookOne | null;
  onUpdateBookOne: (updatedBook: Partial<BookOne>) => void;
  loading: boolean;
  error: string | null;
}

const infotext = `Create a 100 word pitch, where you present your future vision. You are unsure what to write about? Ask Madida in the window on this page. She will guide you through the steps you need to take to create your pitch. Once you are done with the pitch, generate an image that reflects your vision. Take your time to finalize this task.`;

const FuturePitchExercise: React.FC<{ readonly?: boolean }> = ({ readonly = false }) => {
  const { bookOne, onUpdateBookOne, loading, error } = useOutletContext<FuturePitchOutletContext>();

  const [answers, setAnswers] = useState<FuturePitch>({
    left: {
      title: 'My future vision pitch',
      answer: bookOne?.exercises.futurePitchAnswer.left.answer || '',
    },
  });


  const handleAnswerChange = (side: 'left') => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          futurePitchAnswer: {
            ...bookOne.exercises.futurePitchAnswer,
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

        <ExpandingTextArea
          id="future-pitch-text-area-left"
          instructionText=""
          value={answers.left.answer}
          onChange={handleAnswerChange('left')}
          rows={20}
          readonly={readonly}
        />
      </div>
      <div style={separatorStyle} />
      <div style={panelStyle}>
        <ChatBot />
      </div>
    </div>
  );
};

export default FuturePitchExercise;
