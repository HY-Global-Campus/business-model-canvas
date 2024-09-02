
import React, { useState, useEffect, CSSProperties } from 'react';
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
import { shallow } from 'zustand/shallow';
import useStore, { RFState} from '../../store.ts';
import '@xyflow/react/dist/style.css';
import '../Mindmap/Flow.css';
import MindMapEdge from '../Mindmap/MindMapEdge';
import MindMapNode from '../Mindmap/MindMapNode';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  loadState: state.loadState,
  saveState: state.saveState,
  setUserId: state.setUserId 
});




const ViewAllExercises: React.FC = () => {

  const [bookOne, setBookOne] = useState<BookOne | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
const { nodes, edges, setUserId, loadState } = useStore(selector, shallow);
 
	const { userId } = useParams();
	



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
	setUserId(userId!);
      loadState();
    }
  }, [userId]);



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

  return (
    <>
      <div style={pageStyle}>
	<ExerciseContext.Provider value={{ bookOne, onUpdateBookOne: () => {}, loading, error, readonly: true }}>
		<ChooseChallengeExercise />
	<div style={{width: '1000px', height: '800px', border: '2px solid black'}}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
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
