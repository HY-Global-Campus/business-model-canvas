
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useCallback, useRef } from 'react';
import ReactFlow, { Controls, Panel, NodeOrigin, useReactFlow, Connection } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore, { RFState } from '../../store';
import 'reactflow/dist/style.css';
import Header from '../../Components/Header';
import './Flow.css'; // Import the CSS file for styling
import InfoIcon from '../../Components/InfoIcon';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
});

const nodeOrigin: NodeOrigin = [0.5, 0.5];

const infotext = `Starting from the written definition of the challenge you chose, map out the elements of the system in which the problem exists. You can do that with the help of the content you find in the game.`;

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useStore(selector, shallow);
  const { project } = useReactFlow();
  const handleConnectStart = useCallback((_, { nodeId }: { nodeId: string }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const handleConnectEnd = useCallback(
    (event: MouseEvent) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = (event.target as HTMLElement).classList.contains('react-flow__pane');

      if (targetIsPane) {
        const newNodeId = `${nodes.length + 1}`;
        const newNode = {
          id: newNodeId,
          position: project({ x: event.clientX, y: event.clientY }),
          data: { label: `Node ${newNodeId}` },
          origin: [0.5, 0.0],
        };

        addNode(newNode.position);
        const connection: Connection = {
          source: connectingNodeId.current!,
          sourceHandle: null,
          target: newNodeId,
          targetHandle: null,
        };
        onConnect(connection);
        connectingNodeId.current = null;
      }
    },
    [project, addNode, onConnect, nodes.length]
  );

  return (
    <>
      <Header />
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={handleConnectStart}
          onConnectEnd={handleConnectEnd}
          nodeOrigin={nodeOrigin}
          fitView
        >
          <Controls showInteractive={false} />
          <Panel position="top-left">
  
            <h1>Map of connections</h1>

            <p> Add your notes and complete the map of connections</p>
            </Panel>
          <Panel position="top-right" >
                                  <InfoIcon
              infoText={infotext}
              />
          </Panel>
        </ReactFlow>
      </div>
    </>
  );
}

export default Flow;

