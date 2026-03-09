import React, { useCallback } from 'react';
import { useExerciseContext } from './ExerciseContext';
import { exercisesMeta } from '../../../content/exercises';
import { useLocation } from 'react-router-dom';
import ChatBot from '../ChatBot';

const fieldCopy: Record<string, { title: string; description: string; placeholder: string }> = {
  ilosBeforeAI: {
    title: '1. ILOs before AI',
    description:
      'What are the ILOs of your course? Define 3 to 5 ILOs. If you are developing an existing course, develop them further. If you are working with a new course, formulate the ILOs.',
    placeholder: 'Type your answer here max 150 words',
  },
  ilosAfterAI: {
    title: '2. ILOs after AI (final ILOs)',
    description:
      `Ask the Chatbot to give you feedback about your ILOs. Start by using the following prompt: "Please comment how the intended learning outcomes of my course could be improved. Please make sure that my intended learning outcomes use the following structure: Upon completing the course + student is able to + Bloom's taxonomy action verb + object and context. Give suggestions for the Bloom's taxonomy action verbs. Next. I will paste the text that you should comment." After the feedback, adjust your ILOs if needed.`,
    placeholder: 'Type your answer here max 150 words',
  },
  argueChoice: {
    title: '3. Argue your choice of the final ILOs and reflect on the use of AI',
    description:
      'Remember to be critical when considering AI based feedback. Reflect on the feedback given by AI and justify your choice of ILOs.',
    placeholder: 'Type your answer here max 150 words',
  },
};

const LearningObjectivesExercise: React.FC = () => {
  const { bookOne, onUpdateBookOne, readonly } = useExerciseContext();
  const location = useLocation();
  const meta = exercisesMeta.find(e => e.route === location.pathname);

  if (!meta) return null;

  const getFieldValue = useCallback((fieldLabel: string) => {
    if (!bookOne || !meta?.id) return '';
    const exerciseData = (bookOne as any).exercises?.[meta.id];
    return exerciseData?.[fieldLabel] || '';
  }, [bookOne, meta?.id]);

  const updateFieldValue = useCallback((fieldLabel: string, value: string) => {
    if (!onUpdateBookOne || !meta?.id) return;
    
    // Use a function to get the current state instead of relying on stale closure
    onUpdateBookOne((currentBookOne: any) => {
      if (!currentBookOne) return currentBookOne;
      
      const currentData = currentBookOne.exercises?.[meta.id] || {};
      const updatedData = {
        ...currentData,
        [fieldLabel]: value
      };

      return {
        ...currentBookOne,
        exercises: {
          ...currentBookOne.exercises,
          [meta.id]: updatedData
        }
      };
    });
  }, [onUpdateBookOne, meta?.id]);

  if (!meta?.props?.leftColumn || !meta?.props?.rightColumn) {
    return <div>Invalid exercise configuration</div>;
  }

  const { leftColumn, rightColumn } = meta.props;

  return (
    <div className="exercise-content">
      <div className="exercise-two-column">
        <div className="exercise-column">
          <h2 className="exercise-title">{leftColumn.title}</h2>
          {leftColumn.fields.map((field, index) => (
            <div key={index} style={{ marginBottom: 'clamp(16px, 2vh, 28px)' }}>
              <label style={{
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                fontFamily: "'Gotham Narrow', Arial, sans-serif",
                fontSize: '16px',
                color: '#000'
              }}>
                {fieldCopy[field.label]?.title ?? field.label}
              </label>
              <p
                className="exercise-description"
                style={{
                  marginBottom: '12px',
                  lineHeight: '1.5',
                  fontSize: '16px',
                  color: '#000',
                }}
              >
                {fieldCopy[field.label]?.description ?? field.placeholder}
              </p>
              <textarea
                className="exercise-textarea"
                value={getFieldValue(field.label)}
                onChange={(e) => updateFieldValue(field.label, e.target.value)}
                disabled={readonly}
                placeholder={fieldCopy[field.label]?.placeholder ?? field.placeholder}
                required={field.required}
                rows={6}
                style={{
                  width: '100%',
                  border: '1px solid #000',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '16px',
                  fontFamily: "'Gotham Narrow', Arial, sans-serif",
                  background: 'white',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: 'clamp(110px, 14vh, 180px)'
                }}
              />
            </div>
          ))}
        </div>
        <div className="exercise-column">
          <h2 className="exercise-title learning-objectives-chat-title">{rightColumn.title}</h2>
          <div className="learning-objectives-chat-shell">
            <div className="learning-objectives-chat-label">
              Conversation with Chatbot
            </div>
            <div className="learning-objectives-chat-body">
              <ChatBot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningObjectivesExercise;
