
import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {debounce} from 'lodash';
import ExpandingTextArea from './ExpandingTextarea';
import { containerStyle, panelStyle, separatorStyle } from './styles';
import { ChooseChallenge } from '../../../types/exercises';
import { getBookOneByUserId, updateBookOne } from '../../api/bookOneService';
import { BookOne } from '../../api/bookOneService';
import InfoIcon from '../InfoIcon';

interface ChooseChallengeProps {
}


const chosenChallengeInfoText = `Find one problem related to climate change that you find interesting. Use the OWL box in the beginning of this training programme to get familiar with the different challenges. Remember there are many aspects to climate change, not only  meteorological but also ecological, social, cultural, economic, political  and others. Choose a problem that calls to you, something you want to explore more.

`

  const challengeDescriptionInfoText = `
Write a definition for the problem you have chosen. What exactly does it mean? Why is it a problem? What are the causes and  consequences it implies?`

const ChooseChallengeExercise: React.FC<ChooseChallengeProps> = () => {
  const [bookOne, setBookOne] = useState<BookOne | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<ChooseChallenge>({
    left: {
      title: 'Chosen Challenge',
      description: 'Choose a challenge of the boreal forest caused by climate change',
      answer: '',
    },
    right: {
      title: 'Challenge description',
      description: 'Describe your chosen challenge',
      answer: '',
    },
  });
  const userId = sessionStorage.getItem('id');

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchBookOne = async () => {
      try {
        const data = await getBookOneByUserId(userId!);
        setBookOne(data);
        setAnswers({
          left: {
            title: 'Chosen Challenge',
            description: 'Choose a challenge of the boreal forest caused by climate change',
            answer: data.exercises.chooseChallengeAnswer.left.answer,
          },
          right: {
            title: 'Challenge description',
            description: 'Describe your chosen challenge',
            answer: data.exercises.chooseChallengeAnswer.right.answer,
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

  const handleAnswerChange = (side: 'left' | 'right') => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [side]: {
        ...prevAnswers[side],
        answer: value,
      },
    }));

    setBookOne((prevBookOne) => {
      if (!prevBookOne) return prevBookOne;

      const updatedBook = {
        ...prevBookOne,
        exercises: {
          ...prevBookOne.exercises,
          chooseChallengeAnswer: {
            ...prevBookOne.exercises.chooseChallengeAnswer,
            [side]: { answer: value },
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
        <InfoIcon
          infoText={chosenChallengeInfoText}
        />
        <h2>{answers.left.title}</h2>

        <p>{answers.left.description}</p>
        <ExpandingTextArea
          id="choose-challenge-text-area-1"
          instructionText=""
          value={answers.left.answer}
          onChange={handleAnswerChange('left')}
        />
      </div>
      <div style={separatorStyle} />
      <div style={panelStyle}>
        <InfoIcon
          infoText={challengeDescriptionInfoText}
        />
        <h2>{answers.right.title}</h2>

        <p>{answers.right.description}</p>
        <ExpandingTextArea
          id="choose-challenge-text-area-2"
          instructionText=""
          value={answers.right.answer}
          onChange={handleAnswerChange('right')}
          rows={20}
        />
      </div>
    </div>
  );
};

export default ChooseChallengeExercise;

