
import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import Header from '../../Components/Header';
import { getBookOneByUserId, updateBookOne, BookOne } from '../../api/bookOneService';
import { ExerciseContext } from '../../Components/Exercise/ExerciseContext';

const ExercisePage: React.FC = () => {

  const [bookOne, setBookOne] = useState<BookOne | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const userId = sessionStorage.getItem('id');
  const [toggle, setToggle] = useState<boolean>(false);

  useEffect(() => {
    const fetchBookOne = async () => {
      try {
        const data = await getBookOneByUserId(userId!);
        setBookOne(data);
      } catch (err) {
        setError('Failed to fetch BookOne data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookOne();
    }
  }, [userId, toggle]);

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
      setToggle(!toggle);
    },
    onError: (error) => {
      console.error('Error updating BookOne:', error);
    },
  });

  const debouncedUpdateBookOne = useRef(
    debounce((updatedBook: Partial<BookOne>) => mutation.mutate(updatedBook), 500)
  ).current;

  const pageStyle: CSSProperties = {
    padding: '0px 20px',
  };

  return (
    <>
      <Header />
      <div style={pageStyle}>
	<ExerciseContext.Provider value={{ bookOne, loading, error, readonly: false, onUpdateBookOne: debouncedUpdateBookOne }}>
	<Outlet  />
	</ExerciseContext.Provider>
      </div>
    </>
  );
};

export default ExercisePage;
