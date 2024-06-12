
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  OnConnect,
  Connection,
  XYPosition,
} from 'reactflow';
import { createWithEqualityFn } from 'zustand/traditional';

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (position: XYPosition) => void;
};

const useStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: [
    {
      id: 'root',
      type: 'mindmap',
      data: { label: 'Book of Serendip' },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (params: Edge | Connection) => {
    set({
      edges: addEdge(params, get().edges),
    });
  },
  addNode: (position: XYPosition) => {
    const newNode: Node = {
      id: `${get().nodes.length + 1}`,
      type: 'mindmap',
      data: { label: `Node ${get().nodes.length + 1}` },
      position,
    };
    set({
      nodes: [...get().nodes, newNode],
    });
    console.log('New node added:', newNode);
  },
}));

export default useStore;


