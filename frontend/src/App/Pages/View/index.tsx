
import React, { CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBookOneByUserId, BookOne } from '../../api/bookOneService';
import { useParams } from 'react-router';
import { ExerciseContext } from '../../Components/Exercise/ExerciseContext';
import ChooseChallengeExercise from '../../Components/Exercise/ChooseChallenge'; 
import FromFutureToPresentExercise from '../../Components/Exercise/FromFutureToPresent';
import FuturePitchExercise from '../../Components/Exercise/FuturePitch';
import IdentifyLeveragePointsExercise from '../../Components/Exercise/IdentifyLeveragePoints';
import RedefineChallengeExercise from '../../Components/Exercise/RedefineChallenge';
import ValuesExercise from '../../Components/Exercise/Values';
import { ReactFlow, Panel, NodeOrigin, Controls, ConnectionLineType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../Mindmap/Flow.css';
import MindMapEdge from '../Mindmap/MindMapEdge';
import MindMapNode from '../Mindmap/MindMapNode';
import { Navigate } from 'react-router-dom';
import axios from 'axios';



const ViewAllExercises: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  // Use `useQuery` to fetch the bookOne data
  const { data: bookOne, isLoading: loading, error } = useQuery<BookOne, Error>({
    queryKey: ['bookone', userId], // Unique query key
    queryFn: () => getBookOneByUserId(userId!), // Query function
    enabled: !!userId // Only run if userId exists
,
  });




  const pageStyle: CSSProperties = {
    padding: '0px 20px',
  };

  const nodeTypes = {
    mindmap: MindMapNode,
  };

  const edgeTypes = {
    mindmap: MindMapEdge,
  };

  const connectionLineStyle = { stroke: '#F6AD55', strokeWidth: 3 };
  const defaultEdgeOptions = { style: connectionLineStyle, type: 'mindmap' };
  const nodeOrigin: NodeOrigin = [0.5, 0.5];

    if (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      sessionStorage.clear();
      return <Navigate to ="/login" />;
      }
  }

  return (
    <>
      <div style={pageStyle}>
        <ExerciseContext.Provider
          value={{ bookOne: bookOne || null, onUpdateBookOne: () => {}, loading, error: error?.message || null, readonly: true }}
        >
          <ChooseChallengeExercise />
          <div style={{ width: '1000px', height: '800px', border: '2px solid black' }}>
            <ReactFlow
              nodes={bookOne?.mindmap.nodes || []}
              edges={bookOne?.mindmap.edges || []}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              nodeOrigin={nodeOrigin}
              connectionLineStyle={connectionLineStyle}
              defaultEdgeOptions={defaultEdgeOptions}
              connectionLineType={ConnectionLineType.Straight}
              fitView
            >
              <Controls showInteractive={false} />
              <Panel position="top-left" className="header">
                React Flow Mind Map
              </Panel>
            </ReactFlow>
          </div>
          <IdentifyLeveragePointsExercise />
          <RedefineChallengeExercise />
          <ValuesExercise />
          <FromFutureToPresentExercise />
          <FuturePitchExercise />
        </ExerciseContext.Provider>
      </div>
    </>
  );
};

export default ViewAllExercises;
