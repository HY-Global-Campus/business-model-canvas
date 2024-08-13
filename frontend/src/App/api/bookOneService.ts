
import api from './axiosInstance';
import { BookOneExercises } from '../../types/exercises';
import { MindMap } from '../../types/mindmap';

export interface BookOne {
  id: number;
  exercises: BookOneExercises;
  mindmap: MindMap;
}

export const getAllBookOnes = async (): Promise<BookOne[]> => {
  const response = await api.get<BookOne[]>('/bookones');
  return response.data;
};

export const getBookOneById = async (id: number): Promise<BookOne> => {
  const response = await api.get<BookOne>(`/bookones/${id}`);
  return response.data;
};

export const getBookOneByUserId = async (id: string) : Promise<BookOne> => {
  const response = await api.get<BookOne>(`/bookones/user/${id}`);
  return response.data;
}

export const createBookOne = async (book: Omit<BookOne, 'id'>): Promise<BookOne> => {
  const response = await api.post<BookOne>('/bookones', book);
  return response.data;
};

export const updateBookOne = async (id: number, book: Partial<BookOne>): Promise<BookOne> => {
  const response = await api.put<BookOne>(`/bookones/${id}`, book);
  return response.data;
};

export const deleteBookOne = async (id: number): Promise<void> => {
  await api.delete(`/bookones/${id}`);
};



