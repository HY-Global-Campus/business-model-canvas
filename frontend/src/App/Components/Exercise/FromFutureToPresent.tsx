
import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import ExpandingTextArea from './ExpandingTextarea';
import { containerStyle, panelStyle, separatorStyle } from './styles';
import { FromFutureToPresent } from '../../../types/exercises';
import { getBookOneByUserId, updateBookOne } from '../../api/bookOneService';
import { BookOne } from '../../api/bookOneService';
import InfoIcon from '../InfoIcon';

interface FromFutureToPresentProps {}

const infotextQ1 = `Thinking about the futures that could be for the problem you’ve chosen. What are the probable, possible and desirable futures for this specific aspect you want to change? Think about how futures are different when they are based on reactions or actions (discuss difference between  mitigation and adaptation—and perhaps beyond those two, creation?). Think about the different stakeholders and interests that can also  influence the system. Imagine the multiple perspectives they represent,  their motivations and their desires. Now, choose one desirable future for your problem and the aspect you are working with, and describe it. It is the year 2050: What is the state of the  problem?`

const infotextQ2 = `Trace back, step by step, what happened during the past 25 years to achieve the change in the system you have described. Focus on the specific aspect you identified and the scenario for 2050 you envisioned. What is required to get to the 2050 you have chosen? What do you have  to do? What is required of others? What material requirements do you  need? What is your role in the change? Who do you want to be in this plan? What does your plan mean for your future personally and professionally? What obstacles did you encounter and how did you overcome them?  What do you need to make this future come true? Think about how you are already  becoming your future self, but how you also exist within a system. How  can you influence the system you live in that determines what is probable, possible and desirable for you?` 

const FromFutureToPresentExercise: React.FC<FromFutureToPresentProps> = () => {
  const [bookOne, setBookOne] = useState<BookOne | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<FromFutureToPresent>({
    left: {
      title: 'From Future to Present - Left',
      question: '',
      answer: '',
    },
    right: {
      title: 'From Future to Present - Right',
      description: '',
      question1: { title: 'Step 1', answer: '' },
      question2: { title: 'Step 2', answer: '' },
      question3: { title: 'Step 3', answer: '' },
      question4: { title: 'Step 4', answer: '' },
      question5: { title: 'Step 5', answer: '' },
      question6: { title: 'Step 6', answer: '' },
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
            title: 'From Future to Present',
            question: `Question 1.
Think about your desirable future vision for 2050. Imagine one day of your desirable future. Describe that day.
It can be about: the city of the future (its people, culture, technology,..etc..) , or the boreal forests in the future, or the school of the future, or something else you prefer.`,
            answer: data.exercises.fromFutureToPresentAnswer.left.answer,
          },
          right: {
            title: 'Question 1.',
            description: `Imagine you are now in 2050 telling your success story. Describe your path from 2050 to present and do a narrative in the past tense, for example: “Back in the days in 2023,  I started by .....”. In your success story, describe: What caused the system to change? What did you do to impact the system? Did you need help? What obstacles did you encounter? How did you overcome them? What was your role in this process?

Make a timeline 2024-2050. Mark down all the significant steps and events that led to the solution. What was your first action in 2024?`,
            question1: { title: 'Step 1', answer: data.exercises.fromFutureToPresentAnswer.right.question1.answer },
            question2: { title: 'Step 2', answer: data.exercises.fromFutureToPresentAnswer.right.question2.answer },
            question3: { title: 'Step 3', answer: data.exercises.fromFutureToPresentAnswer.right.question3.answer },
            question4: { title: 'Step 4', answer: data.exercises.fromFutureToPresentAnswer.right.question4.answer },
            question5: { title: 'Step 5', answer: data.exercises.fromFutureToPresentAnswer.right.question5.answer },
            question6: { title: 'Step 6', answer: data.exercises.fromFutureToPresentAnswer.right.question6.answer },
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

  const handleAnswerChange = (side: 'left' | 'right', question?: 'question1' | 'question2' | 'question3' | 'question4' | 'question5' | 'question6') => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          fromFutureToPresentAnswer: {
            ...prevBookOne.exercises.fromFutureToPresentAnswer,
            [side]: {
              ...prevBookOne.exercises.fromFutureToPresentAnswer[side],
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
        <InfoIcon
          infoText={infotextQ1}
          />
        <p>{answers.left.question}</p>
        <ExpandingTextArea
          id="from-future-to-present-left"
          instructionText=""
          value={answers.left.answer}
          onChange={handleAnswerChange('left')}
          rows={16}
        />
      </div>
      <div style={separatorStyle} />
      <div style={panelStyle}>
        <h2>{answers.right.title}</h2>
        <InfoIcon
          infoText={infotextQ2}
          />
        <p>{answers.right.description}</p>
        <h3>{answers.right.question1.title}</h3>
        <ExpandingTextArea
          id="from-future-to-present-question1"
          instructionText=""
          value={answers.right.question1.answer}
          onChange={handleAnswerChange('right', 'question1')}
          rows={2}
        />
        <h3>{answers.right.question2.title}</h3>
        <ExpandingTextArea
          id="from-future-to-present-question2"
          instructionText=""
          value={answers.right.question2.answer}
          onChange={handleAnswerChange('right', 'question2')}
          rows={2}
        />
        <h3>{answers.right.question3.title}</h3>
        <ExpandingTextArea
          id="from-future-to-present-question3"
          instructionText=""
          value={answers.right.question3.answer}
          onChange={handleAnswerChange('right', 'question3')}
          rows={2}
        />
        <h3>{answers.right.question4.title}</h3>
        <ExpandingTextArea
          id="from-future-to-present-question4"
          instructionText=""
          value={answers.right.question4.answer}
          onChange={handleAnswerChange('right', 'question4')}
          rows={2}
        />
        <h3>{answers.right.question5.title}</h3>
        <ExpandingTextArea
          id="from-future-to-present-question5"
          instructionText=""
          value={answers.right.question5.answer}
          onChange={handleAnswerChange('right', 'question5')}
          rows={2}
        />
        <h3>{answers.right.question6.title}</h3>
        <ExpandingTextArea
          id="from-future-to-present-question6"
          instructionText=""
          value={answers.right.question6.answer}
          onChange={handleAnswerChange('right', 'question6')}
          rows={2}
        />
      </div>
    </div>
  );
};

export default FromFutureToPresentExercise;
