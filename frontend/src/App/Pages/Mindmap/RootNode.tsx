
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { Handle, Node, NodeProps, Position } from '@xyflow/react';

import useStore from '../../store';

export type NodeData = {
  label: string;
};

function RootNode({ id, data }: NodeProps<Node<NodeData>>) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const [label, setLabel] = useState(data.label);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = 'auto';
      inputRef.current.style.height = 'auto';
      inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [label]);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    }, 1);
  }, []);

  const handleParentClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        } else console.log("no input ref")
        console.log("handle parent click")
    };

  return (
    <>
      <div className="inputWrapper" >
        <div className="dragHandle" onClick={handleParentClick}>
          {/* icon taken from grommet https://icons.grommet.io */}
          <svg viewBox="0 0 24 24">
            <path
              fill="#333"
              stroke="#333"
              strokeWidth="1"
              d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
            />
          </svg>
        </div>
        <textarea
          value={label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value, setLabel)}
          className="input"
          ref={inputRef}
        />
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </>
  );
}

export default RootNode;
