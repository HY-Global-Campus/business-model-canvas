import ReactFlow, { Controls, Panel, NodeOrigin } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { CSSProperties } from 'react';
import useStore, { RFState } from '../../store';
// we have to import the React Flow styles for it to work
import 'reactflow/dist/style.css';
import Header from '../../Components/Header';
import placeholderImage from '../../../assets/mindmap-placeholder.jpg'
 
const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
});

const placeholderWrapperStyle: CSSProperties = {
  position: 'relative',
  width: '100%', // Ensure wrapper fills container for full responsiveness
  height: '100vh' // Adjust based on your design needs
};

const placeholderStyle: CSSProperties = {
  width: '100%',
  height: '100%',
};


const overlayTextStyle: CSSProperties = {
  position: 'absolute',
  top: '50%', // Center vertically
  left: '50%', // Center horizontally
  transform: 'translate(-50%, -50%)', // Ensure centered regardless of text length
  color: 'white', // Text color
  fontSize: '2rem', // Large text size
  fontWeight: 'bold',
  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)', // Text shadow for better readability
  backgroundColor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent black background
  padding: '10px 20px', // Padding around the text
  borderRadius: '10px', // Rounded corners for the background
  textAlign: 'center', // Center the text inside the box
  width: 'auto', // Auto width based on content
  maxWidth: '80%', // Max width to avoid edge cases
};


// this places the node origin in the center of a node
const nodeOrigin: NodeOrigin = [0.5, 0.5];
 
function Flow() {
  // whenever you use multiple values, you should use shallow to make sure the component only re-renders when one of the values changes
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(
    selector,
    shallow,
  );
 
  return (
    <>
    <Header />
      <div style={placeholderWrapperStyle}>
        <img src={placeholderImage} style={placeholderStyle} alt="Placeholder" />
        <div style={overlayTextStyle}>Under Construction</div>
      </div>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeOrigin={nodeOrigin}
      fitView
      hidden
    >
      <Controls showInteractive={false} />
      <Panel position="top-left">Book of Serendip</Panel>
    </ReactFlow>

  
    </>
  );
}
 
export default Flow;
