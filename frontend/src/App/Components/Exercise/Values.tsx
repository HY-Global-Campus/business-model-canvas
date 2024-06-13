
import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import ExpandingTextArea from './ExpandingTextarea';
import { containerStyle, panelStyle, separatorStyle } from './styles';
import { Values } from '../../../types/exercises';
import { getBookOneByUserId, updateBookOne } from '../../api/bookOneService';
import { BookOne } from '../../api/bookOneService';
import InfoIcon from '../InfoIcon';

interface ValuesProps {}

const infotext = `Choose the values that guide your sustainability actions. What is important for you?`


const ValuesExercise: React.FC<ValuesProps> = () => {
  const [bookOne, setBookOne] = useState<BookOne | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Values>({
    left: {
      title: 'Values',
      description: '',
      question1: { title: 'Question 1', answer: '' },
      question2: { title: 'Question 2', answer: '' },
      question3: { title: 'Question 3', answer: '' },
    },
    right: null,
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
            title: 'Values',
            description: 'Our actions are guided by our deepest values. What are your top three values? Write them below and let them guide your vision for the future.',
            question1: { title: 'Value 1.', answer: data.exercises.valuesAnswer.left.question1.answer },
            question2: { title: 'Value 2.', answer: data.exercises.valuesAnswer.left.question2.answer },
            question3: { title: 'Value 3.', answer: data.exercises.valuesAnswer.left.question3.answer },
          },
          right: null,
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

  const handleAnswerChange = (question: 'question1' | 'question2' | 'question3') => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      left: {
        ...prevAnswers.left,
        [question]: { answer: value },
      },
    }));

    setBookOne((prevBookOne) => {
      if (!prevBookOne) return prevBookOne;

      const updatedBook = {
        ...prevBookOne,
        exercises: {
          ...prevBookOne.exercises,
          valuesAnswer: {
            ...prevBookOne.exercises.valuesAnswer,
            left: {
              ...prevBookOne.exercises.valuesAnswer.left,
              [question]: { answer: value },
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
        <InfoIcon
          infoText={infotext}
        />
        <p>{answers.left.description}</p>
        <h3>{answers.left.question1.title}</h3>
        <ExpandingTextArea
          id="values-question1"
          instructionText=""
          value={answers.left.question1.answer}
          onChange={handleAnswerChange('question1')}
          rows={2}
        />
        <h3>{answers.left.question2.title}</h3>
        <ExpandingTextArea
          id="values-question2"
          instructionText=""
          value={answers.left.question2.answer}
          onChange={handleAnswerChange('question2')}
          rows={2}
        />
        <h3>{answers.left.question3.title}</h3>
        <ExpandingTextArea
          id="values-question3"
          instructionText=""
          value={answers.left.question3.answer}
          onChange={handleAnswerChange('question3')}
          rows={2}
        />
      </div>
      <div style={separatorStyle} />
      <div style={panelStyle}>
        <h3> Tree of values </h3>
      </div>
    </div>
  );
};

export default ValuesExercise;

