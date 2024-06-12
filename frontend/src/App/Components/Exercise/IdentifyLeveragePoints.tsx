
import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import ExpandingTextArea from './ExpandingTextarea';
import { containerStyle, panelStyle, separatorStyle } from './styles';
import { IdentifyLeveragePoints } from '../../../types/exercises';
import { getBookOneByUserId, updateBookOne } from '../../api/bookOneService';
import { BookOne } from '../../api/bookOneService';

interface IdentifyLeveragePointsProps {}

const IdentifyLeveragePointsExercise: React.FC<IdentifyLeveragePointsProps> = () => {
  const [bookOne, setBookOne] = useState<BookOne | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<IdentifyLeveragePoints>({
    left: {
      title: 'Leverage Points - Left',
      description: '',
      question1: { title: 'Question 1', answer: '' },
      question2: { title: 'Question 2', answer: '' },
      question3: { title: 'Question 3', answer: '' },
    },
    right: {
      title: 'Leverage Points - Right',
      description: 'Describe overall leverage points and their impacts',
      answer: '',
    },
  });
  const userId = localStorage.getItem('id');

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchBookOne = async () => {
      try {
        const data = await getBookOneByUserId(userId!);
        setBookOne(data);
        setAnswers({
          left: {
            title: 'Identify the leverage points',
      description: `
Leverage points are places within a complex system where a small shift in one thing can produce big changes in everything.

Look at your Map of Connections and estimate how easy/hard it is to affect different factors of the system. In the boxes bellow, mark factors based on the level of change.`,
            question1: { title: 'Easy to change', answer: data.exercises.identifyLeveragePointsAnswer.left.question1.answer },
            question2: { title: 'Require something in order to change', answer: data.exercises.identifyLeveragePointsAnswer.left.question2.answer },
            question3: { title: 'Difficult to change', answer: data.exercises.identifyLeveragePointsAnswer.left.question3.answer },
          },
          right: {
            title: 'Chosen leverage point',
            description: 'Choose one leverage point! The chosen leverage point should be one that you have some control on how you affect it.',
            answer: data.exercises.identifyLeveragePointsAnswer.right.answer,
          },
        });
      } catch (err) {
        setError('Failed to fetch BookOne data');
      } finally {
        setLoading(false);
      }
    };

    fetchBookOne();
  }, [userId]);

  const mutation = useMutation<BookOne, Error, Partial<BookOne>>({
    mutationFn: async (updatedBook: Partial<BookOne>) => {
      if (!bookOne) {
        throw new Error('bookOne is not defined');
      }
      return await updateBookOne(bookOne.id, updatedBook);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookone', userId] });
      console.log('BookOne updated successfully');
    },
    onError: (error) => {
      console.error('Error updating BookOne:', error);
    }
  });

  const debouncedMutation = useRef(
    debounce((updatedBook: Partial<BookOne>) => mutation.mutate(updatedBook), 500)
  ).current;

  const handleAnswerChange = (side: 'left' | 'right', question?: 'question1' | 'question2' | 'question3') => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [side]: {
        ...prevAnswers[side],
        ...(question ? { [question]: { answer: value } } : { answer: value }),
      },
    }));

    setBookOne((prevBookOne) => {
      if (!prevBookOne) return prevBookOne;

      const updatedBook = {
        ...prevBookOne,
        exercises: {
          ...prevBookOne.exercises,
          identifyLeveragePointsAnswer: {
            ...prevBookOne.exercises.identifyLeveragePointsAnswer,
            [side]: {
              ...prevBookOne.exercises.identifyLeveragePointsAnswer[side],
              ...(question ? { [question]: { answer: value } } : { answer: value }),
            },
          },
        },
      };

      debouncedMutation(updatedBook);
      return updatedBook;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <h2>{answers.left.title}</h2>
        <p>{answers.left.description}</p>
        <h3>{answers.left.question1.title}</h3>
        <ExpandingTextArea
          id="identify-leverage-points-question1"
          instructionText=""
          value={answers.left.question1.answer}
          onChange={handleAnswerChange('left', 'question1')}
          rows={2}
        />
        <h3>{answers.left.question2.title}</h3>
        <ExpandingTextArea
          id="identify-leverage-points-question2"
          instructionText=""
          value={answers.left.question2.answer}
          onChange={handleAnswerChange('left', 'question2')}
          rows={2}
        />
        <h3>{answers.left.question3.title}</h3>
        <ExpandingTextArea
          id="identify-leverage-points-question3"
          instructionText=""
          value={answers.left.question3.answer}
          onChange={handleAnswerChange('left', 'question3')}
          rows={2}
        />
      </div>
      <div style={separatorStyle} />
      <div style={panelStyle}>
        <h2>{answers.right.title}</h2>
        <p>{answers.right.description}</p>
        <ExpandingTextArea
          id="identify-leverage-points-right"
          instructionText=""
          value={answers.right.answer}
          onChange={handleAnswerChange('right')}
          rows={20}
        />
      </div>
    </div>
  );
};

export default IdentifyLeveragePointsExercise;

