import React, { useState, useEffect } from 'react';
import ExpandingTextArea from './ExpandingTextarea';
import { containerStyle, panelStyle, separatorStyle } from './styles';
import { ChooseChallenge } from '../../../types/exercises';
import { useExerciseContext } from './ExerciseContext';


const chosenChallengeInfoText = `
Find a business-related challenge that you find meaningful or interesting.
You can explore a range of challenges faced in the business world. 
Remember, these challenges can span multiple dimensions—not just financial, but also social, cultural, operational, technological, environmental, ethical, and more.

Choose one problem that resonates with you. I should be something you would like to explore further using the Business Model Canvas (BMC). 
Aim to identify a real-world issue that could benefit from a fresh, well-structured business model solution.
`;

const challengeDescriptionInfoText = `Write a definition for the problem you have chosen. What exactly does it mean? Why is it a problem? What are the causes and  consequences it implies?`;

const ChooseChallengeExercise: React.FC = () => {
  const { bookOne, onUpdateBookOne, loading, error, readonly } = useExerciseContext();
  const [answers, setAnswers] = useState<ChooseChallenge>({
    left: {
      title: 'Chosen Challenge',
      description: 'Explore the chosen challenge and explain it in the text box below',
      answer: bookOne?.exercises.chooseChallengeAnswer.left.answer || '',
    },
    right: {
      title: 'Challenge description',
      description: 'Describe your chosen challenge using BMC in the text box below',
      answer: bookOne?.exercises.chooseChallengeAnswer.right.answer || '',
    },
  });
  useEffect(() => {
    if (bookOne) {
      setAnswers((prev) => ({
        left: {
          ...prev.left,
          answer: bookOne.exercises.chooseChallengeAnswer.left.answer || '',
        },
        right: {
          ...prev.right,
          answer: bookOne.exercises.chooseChallengeAnswer.right.answer || '',
        },
      }));
    }
  }, [bookOne]);


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
      bookOne.exercises.chooseChallengeAnswer[side].answer = value; 
        onUpdateBookOne(bookOne); 
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
       <h2>{answers.left.title}</h2>
        <p><i>{chosenChallengeInfoText}</i></p>
        <p>{answers.left.description}</p>
        <ExpandingTextArea
          id="choose-challenge-text-area-1"
          instructionText=""
          value={answers.left.answer}
          onChange={handleAnswerChange('left')}
          readonly={readonly}
        />
      </div>
      <div style={separatorStyle} />
      <div style={panelStyle}>
        <h2>{answers.right.title}</h2>
        <p><i>{challengeDescriptionInfoText}</i></p>
        <p>{answers.right.description}</p>
        <ExpandingTextArea
          id="choose-challenge-text-area-2"
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

export default ChooseChallengeExercise;
