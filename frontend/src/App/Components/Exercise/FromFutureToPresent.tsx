
import React, { useState } from 'react';
import ExpandingTextArea from './ExpandingTextarea';
import { containerStyle, panelStyle, separatorStyle } from './styles';
import { FromFutureToPresent } from '../../../types/exercises';
import InfoIcon from '../InfoIcon';
import StyledTextArea from './StyledTextArea';
import { useOutletContext } from 'react-router-dom';
import { BookOne } from '../../api/bookOneService';

interface FromFutureToPresentOutletContext {
  bookOne: BookOne | null;
  onUpdateBookOne: (updatedBook: Partial<BookOne>) => void;
  loading: boolean;
  error: string | null;
}

const infotextQ1 = `Thinking about the futures that could be for the problem you’ve chosen. What are the probable, possible and desirable futures for this specific aspect you want to change? Think about how futures are different when they are based on reactions or actions (discuss difference between mitigation and adaptation—and perhaps beyond those two, creation?). Think about the different stakeholders and interests that can also influence the system. Imagine the multiple perspectives they represent, their motivations and their desires. Now, choose one desirable future for your problem and the aspect you are working with, and describe it. It is the year 2050: What is the state of the problem?`;

const infotextQ2 = `Trace back, step by step, what happened during the past 25 years to achieve the change in the system you have described. Focus on the specific aspect you identified and the scenario for 2050 you envisioned. What is required to get to the 2050 you have chosen? What do you have to do? What is required of others? What material requirements do you need? What is your role in the change? Who do you want to be in this plan? What does your plan mean for your future personally and professionally? What obstacles did you encounter and how did you overcome them? What do you need to make this future come true? Think about how you are already becoming your future self, but how you also exist within a system. How can you influence the system you live in that determines what is probable, possible and desirable for you?`;

const FromFutureToPresentExercise: React.FC<{ readonly?: boolean }> = ({ readonly = false }) => {
  const { bookOne, onUpdateBookOne, loading, error } = useOutletContext<FromFutureToPresentOutletContext>();

  const [answers, setAnswers] = useState<FromFutureToPresent>({
    left: {
      title: 'From Future to Present - Left',
      question: `Question 1.
Think about your desirable future vision for 2050. Imagine one day of your desirable future. Describe that day.
It can be about: the city of the future (its people, culture, technology,..etc..) , or the boreal forests in the future, or the school of the future, or something else you prefer.`,
      answer: bookOne?.exercises.fromFutureToPresentAnswer.left.answer || '',
    },
    right: {
      title: 'From Future to Present - Right',
      description: `Imagine you are now in 2050 telling your success story. Describe your path from 2050 to present and do a narrative in the past tense, for example: “Back in the days in 2023,  I started by .....”. In your success story, describe: What caused the system to change? What did you do to impact the system? Did you need help? What obstacles did you encounter? How did you overcome them? What was your role in this process?

Make a timeline 2024-2050. Mark down all the significant steps and events that led to the solution. What was your first action in 2024?`,
      question1: { title: 'Step 1', answer: bookOne?.exercises.fromFutureToPresentAnswer.right.question1.answer || '' },
      question2: { title: 'Step 2', answer: bookOne?.exercises.fromFutureToPresentAnswer.right.question2.answer || '' },
      question3: { title: 'Step 3', answer: bookOne?.exercises.fromFutureToPresentAnswer.right.question3.answer || '' },
      question4: { title: 'Step 4', answer: bookOne?.exercises.fromFutureToPresentAnswer.right.question4.answer || '' },
      question5: { title: 'Step 5', answer: bookOne?.exercises.fromFutureToPresentAnswer.right.question5.answer || '' },
      question6: { title: 'Step 6', answer: bookOne?.exercises.fromFutureToPresentAnswer.right.question6.answer || '' },
    },
  });



  const handleAnswerChange = (side: 'left' | 'right', question?: 'question1' | 'question2' | 'question3' | 'question4' | 'question5' | 'question6') => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [side]: {
        ...prevAnswers[side],
        ...(question ? { [question]: { answer: value } } : { answer: value }),
      },
    }));

    if (bookOne) {
      const updatedBook = {
        ...bookOne,
        exercises: {
          ...bookOne.exercises,
          fromFutureToPresentAnswer: {
            ...bookOne.exercises.fromFutureToPresentAnswer,
            [side]: {
              ...bookOne.exercises.fromFutureToPresentAnswer[side],
              ...(question ? { [question]: { answer: value } } : { answer: value }),
            },
          },
        },
      };

      onUpdateBookOne(updatedBook);
    }
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between'
  }

  const numberStyle: React.CSSProperties = {
    marginLeft: '1rem',
    marginTop: '1rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
                <InfoIcon
          infoText={infotextQ1}
          />
        <h2>{answers.left.title}</h2>

        <p>{answers.left.question}</p>
        <ExpandingTextArea
          id="from-future-to-present-left"
          instructionText=""
          value={answers.left.answer}
          onChange={handleAnswerChange('left')}
          rows={16}
          readonly={readonly}
        />
      </div>
      <div style={separatorStyle} />
      <div style={panelStyle}>
                <InfoIcon
          infoText={infotextQ2}
          />
        <h2>{answers.right.title}</h2>

        <p>{answers.right.description}</p>
        <div style={rowStyle} >
          <StyledTextArea
            id="from-future-to-present-question1"
            value={answers.right.question1.answer}
            onChange={handleAnswerChange('right', 'question1')}
            readonly={readonly}
          />
          <div style={numberStyle}>
            2050
          </div>
        </div>
        <div style={rowStyle}>
          <StyledTextArea
            id="from-future-to-present-question2"
            value={answers.right.question2.answer}
            onChange={handleAnswerChange('right', 'question2')}
            readonly={readonly}
          />
          <div style={numberStyle}>
            2045
          </div>
        </div>
        <div style={rowStyle}>
          <StyledTextArea
            id="from-future-to-present-question3"
            value={answers.right.question3.answer}
            onChange={handleAnswerChange('right', 'question3')}
            readonly={readonly}
          />
          <div style={numberStyle}>
            2040
          </div>
        </div>
        <div style={rowStyle}>
          <StyledTextArea
            id="from-future-to-present-question4"
            value={answers.right.question4.answer}
            onChange={handleAnswerChange('right', 'question4')}
            readonly={readonly}
          />
          <div style={numberStyle}>
            2035
          </div>
        </div>
        <div style={rowStyle}>
          <StyledTextArea
            id="from-future-to-present-question5"
            value={answers.right.question5.answer}
            onChange={handleAnswerChange('right', 'question5')}
            readonly={readonly}
          />
          <div style={numberStyle}>
            2030
          </div>
        </div>
        <div style={rowStyle}>
          <StyledTextArea
            id="from-future-to-present-question6"
            value={answers.right.question6.answer}
            onChange={handleAnswerChange('right', 'question6')}
            readonly={readonly}
          />
          <div style={numberStyle}>
            2024
          </div>
        </div>
      </div>
    </div>
  );
};

export default FromFutureToPresentExercise;
