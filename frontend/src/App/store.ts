
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
} from '@xyflow/react';
import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import { BookOne, getBookOneByUserId, updateBookOne } from './api/bookOneService';

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addChildNode: (parentNode: Node, position: XYPosition) => void;
  updateNodeLabel: (nodeId: string, label: string, setLabel: React.Dispatch<React.SetStateAction<string>>) => void;
  saveState: () => void;
  loadState: () => void;
  bookoneId: number | undefined,
};

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    get().saveState()
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    get().saveState();
  },
  addChildNode: (parentNode: Node, position: XYPosition) => {
    const newNode = {
      id: nanoid(),
      type: 'mindmap',
      data: { label: 'New Node' },
      position,
      // parentId: parentNode.id, // uncomment this line to enable parent-child relationship
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
    get().saveState();
  },
  updateNodeLabel: (nodeId: string, label: string, setLabel: React.Dispatch<React.SetStateAction<string>>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          console.log(node.data)
          node.data = { ...node.data, label };
          setLabel(label);
        }

        return node;
      }),
    });
    get().saveState();
  },
  loadState: async () => {
    const userId = sessionStorage.getItem('id');
    try {
      const data = await getBookOneByUserId(userId!);
      set({bookoneId: data.id})
      if (data.mindmap && data.mindmap.nodes && data.mindmap.edges) {
        set({
          nodes: data.mindmap.nodes,
          edges: data.mindmap.edges
        });
      }
    } catch (err) {
      console.log(err); 
    }
  },
  saveState: async () => {
    if ( isEmpty(get().nodes) ) return;
    if (!get().bookoneId) {
      const id = (await getBookOneByUserId(sessionStorage.getItem('id')!)).id
      set({bookoneId: id})
    }
    const updatedBookOne: Partial<BookOne> = {mindmap: { nodes: get().nodes , edges: get().edges}};
    return await updateBookOne(get().bookoneId!,updatedBookOne);
    
  },
  bookoneId: undefined,

}));

export default useStore;

const isEmpty = (value: unknown) => Array.isArray(value) && !value.length;


