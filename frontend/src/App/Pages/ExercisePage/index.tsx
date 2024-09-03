import React, { useRef, CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import Header from '../../Components/Header';
import { getBookOneByUserId, updateBookOne, BookOne } from '../../api/bookOneService';
import { ExerciseContext } from '../../Components/Exercise/ExerciseContext';

const ExercisePage: React.FC = () => {
  const queryClient = useQueryClient();
  const userId = sessionStorage.getItem('id');

  // Use `useQuery` to fetch the bookOne data
  const { data: bookOne, isLoading: loading, error } = useQuery<BookOne, Error>({
    queryKey: ['bookone', userId], // Unique query key
    queryFn: () => getBookOneByUserId(userId!), // Query function
    enabled: !!userId, // Only run if userId exists
  }, queryClient);

  // Mutation for updating BookOne
  const mutation = useMutation<BookOne, Error, Partial<BookOne>>({
    mutationFn: async (updatedBook: Partial<BookOne>) => {
      if (!bookOne) {
        throw new Error('bookOne is not defined');
      }
      return await updateBookOne(bookOne.id, updatedBook);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookone', userId]}); // Invalidate queries after a successful update
      console.log('BookOne updated successfully');
    },
    onError: (error) => {
      console.error('Error updating BookOne:', error);
    },
  }, queryClient);

  // Debounced mutation to avoid multiple rapid updates
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
        <ExerciseContext.Provider value={{ bookOne: bookOne || null, loading, error: error?.message || null, readonly: false, onUpdateBookOne: debouncedUpdateBookOne }}>
          <Outlet />
        </ExerciseContext.Provider>
      </div>
    </>
  );
};

export default ExercisePage;
