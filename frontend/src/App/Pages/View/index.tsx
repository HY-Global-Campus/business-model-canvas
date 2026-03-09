import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Course } from '../../api/courseService';
import { useParams } from 'react-router';
import { ExerciseContext } from '../../Components/Exercise/ExerciseContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header';
import '../pages.css';
import { exercisesMeta } from '../../../content/exercises';
import { useViewportHeightVar } from '../../hooks/useViewportVars';

const ViewAllExercises: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  useViewportHeightVar();

  const { data: bookOne, isLoading: loading, error } = useQuery<Course, Error>({
    queryKey: ['course', userId],
    queryFn: async () => {
      const response = await axios.get<Course>(
        `${import.meta.env.VITE_API_URL}/course/share/${userId}`
      );

      return response.data;
    },
    enabled: !!userId
  });

  return (
    <div
      className="page-with-header"
      style={{
        height: 'var(--app-height, 100dvh)',
        overflow: 'auto',
      }}
    >
      <Header />
      <div className="exercise-container">
        <div className="exercise-content" style={{ width: 'min(100%, 1440px)' }}>
        {error ? (
          <div className="exercise-panel">
            <h2 className="exercise-title">Shared course canvas</h2>
            <p className="exercise-description">
              {axios.isAxiosError(error) && error.response?.status === 404
                ? 'This shared course canvas could not be found.'
                : 'This shared course canvas could not be loaded right now.'}
            </p>
            <Link to="/login" style={{ color: '#000', textDecoration: 'underline' }}>
              Go to login
            </Link>
          </div>
        ) : (
        <ExerciseContext.Provider
          value={{
            bookOne: bookOne || null,
            onUpdateBookOne: () => {},
            loading,
            error: null,
            readonly: true
          }}
        >
          {exercisesMeta.map(meta => {
            const exerciseData = (bookOne as any)?.exercises?.[meta.id];
            return (
            <div key={meta.id} className="exercise-panel">
              <h2 className="exercise-title">{meta.title}</h2>
              {meta.type === 'text' ? (
                <div className="readonly-text">
                  {exerciseData?.value ?? ''}
                </div>
              ) : meta.type === 'two-column' && meta.props?.leftColumn ? (
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    {meta.props.leftColumn.title && <h3 className="exercise-subtitle">{meta.props.leftColumn.title}</h3>}
                    {(meta.props.leftColumn.fields ?? []).map((field: { label: string }, i: number) => (
                      <div key={i} style={{ marginBottom: '16px' }}>
                        <strong>{field.label}:</strong>
                        <div className="readonly-text" style={{ marginTop: '4px' }}>{exerciseData?.[field.label] ?? ''}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    {meta.props.rightColumn?.title && <h3 className="exercise-subtitle">{meta.props.rightColumn.title}</h3>}
                    {(meta.props.rightColumn?.fields ?? []).map((field: { label: string }, i: number) => (
                      <div key={i} style={{ marginBottom: '16px' }}>
                        {field.label && <strong>{field.label}:</strong>}
                        <div className="readonly-text" style={{ marginTop: '4px' }}>{exerciseData?.[field.label] ?? ''}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <table className="table-exercise">
                  <thead>
                    <tr>
                      {(meta.props?.headers ?? []).map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(((bookOne as any)?.exercises?.[meta.id]?.value as string[][]) || []).map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );})}
        </ExerciseContext.Provider>
        )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllExercises;
