# Advanced React Flow Tutorial: Building an Electrical Diagram Maker

## Introduction

This tutorial will guide you through building an electrical diagram maker using React Flow, exploring advanced concepts and techniques. You'll learn how to create custom nodes, edges, implement clean detection, aggregation, node grouping, and much more.

## Table of Contents

- [Advanced React Flow Tutorial: Building an Electrical Diagram Maker](#advanced-react-flow-tutorial-building-an-electrical-diagram-maker)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Project Setup](#project-setup)
  - [Custom Background](#custom-background)
  - [Creating Custom Nodes](#creating-custom-nodes)
    - [Electrical Component Node](#electrical-component-node)
  - [Custom Edges with Animations](#custom-edges-with-animations)
  - [Custom Handles](#custom-handles)
  - [Connection Validation](#connection-validation)
  - [Component Panel](#component-panel)
  - [Component Details Form](#component-details-form)
  - [Edge Reconnection \& Deletion](#edge-reconnection--deletion)
  - [Node Rotation](#node-rotation)
  - [Clean Detection and Aggregation](#clean-detection-and-aggregation)
  - [Node Grouping](#node-grouping)
  - [Resizing Nodes](#resizing-nodes)
  - [Contextual Zoom](#contextual-zoom)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Saving and Loading Projects](#saving-and-loading-projects)
  - [Generating Images](#generating-images)
  - [Utils and Helper Functions](#utils-and-helper-functions)
  - [Final Main Workflow Component Structure](#final-main-workflow-component-structure)
  - [Conclusion](#conclusion)

## Project Setup

The tutorial starts with a basic React Flow component that already has the initial configuration:

```jsx
// Initial project setup with React Flow
// The project has been wrapped with ReactFlowProvider in app.tsx
```

## Custom Background

Let's start by adding a custom mesh-like background:

```jsx
// Adding a background component
<Background 
  variant={BackgroundVariant.Lines} 
  gap={10} 
  color="#F1F1F1" 
  id="1" 
/>
<Background 
  variant={BackgroundVariant.Lines} 
  gap={100} 
  color="#CCC" 
  id="2" 
/>
```

To remove the React Flow attribution:

```css
/* In index.css */
.react-flow__attribution {
  display: none;
}
```

## Creating Custom Nodes

### Electrical Component Node

First, define the types:

```tsx
// In types file
export type ElectricalComponentType = 'resistor' | 'capacitor' | 'inductor' | 'bulb' | 'battery' | 'board';

export type ElectricalComponentData = {
  value: number;
  type: ElectricalComponentType;
  state?: ElectricalComponentState;
  isAttachedToGroup?: boolean;
  visible?: boolean;
  connectable?: boolean;
  rotation?: number;
};

export enum ElectricalComponentState {
  ADD = 'add',
  NOT_ADD = 'not_add'
}

export type ElectricalComponentNode = Node<ElectricalComponentData, string>;
```

Create an electrical component node for resistors, inductors, and capacitors:

```tsx
// ElectricalComponent.tsx
import { Handle, NodeProps, Position } from 'reactflow';
import { Box, Text } from '@chakra-ui/react';
import { ElectricalComponentNode } from '../types';
import { getUnit } from '../utils';
import { Plus, X } from 'react-bootstrap-icons';
import { ResistorIcon, CapacitorIcon, InductorIcon } from '../icons';
import Terminal from './Terminal';

type Props = NodeProps<ElectricalComponentNode>;

const ElectricalComponent = ({ data, selected }: Props) => {
  const { value, type, state, rotation = 0, visible = true, connectable = true } = data;
  const unit = getUnit(type);
  
  const isAdditionValid = state === 'add';
  const isAdditionInvalid = state === 'not_add';

  return (
    <Box 
      position="relative" 
      transform={`rotate(${rotation}deg)`}
      visibility={visible ? 'visible' : 'hidden'}
    >
      {type === 'resistor' && <ResistorIcon height={24} />}
      {type === 'capacitor' && <CapacitorIcon height={24} />}
      {type === 'inductor' && <InductorIcon height={24} />}
      
      <Text 
        fontSize="xxsmall" 
        position="absolute" 
        bottom={0} 
        left={0}
      >
        {value}{unit}
      </Text>
      
      <Terminal 
        type="source" 
        position={Position.Right} 
        id="right" 
        isConnectable={connectable}
      />
      <Terminal 
        type="source" 
        position={Position.Left} 
        id="left" 
        isConnectable={connectable}
      />
      
      {isAdditionValid && (
        <Plus 
          style={{ 
            position: 'absolute', 
            top: -7, 
            right: 2, 
            background: '#58E58E' 
          }} 
        />
      )}
      
      {isAdditionInvalid && (
        <X 
          style={{ 
            position: 'absolute', 
            top: -7, 
            right: 2, 
            background: '#FF0505' 
          }} 
        />
      )}
    </Box>
  );
};

export default ElectricalComponent;
```

Add more node types for bulb and battery:

```tsx
// Bulb.tsx
import { NodeProps, Position } from 'reactflow';
import { Box, Text } from '@chakra-ui/react';
import { ElectricalComponentNode } from '../types';
import { getUnit } from '../utils';
import BulbIcon from '../icons/Bulb';
import Terminal from './Terminal';

const Bulb = ({ data, selected }: NodeProps<ElectricalComponentNode>) => {
  const { value, type, isOn } = data;
  const unit = getUnit(type);
  
  return (
    <Box>
      <BulbIcon height={64} isOn={isOn} />
      <Text 
        fontSize="xxsmall" 
        position="absolute" 
        bottom={0} 
        left={0}
      >
        {value}{unit}
      </Text>
      
      <Terminal 
        type="source" 
        position={Position.Right} 
        id="right" 
        style={{ top: 50, right: 22 }}
      />
      <Terminal 
        type="source" 
        position={Position.Left} 
        id="left" 
        style={{ top: 50, left: 22 }}
      />
    </Box>
  );
};

export default Bulb;
```

```tsx
// Battery.tsx
import { NodeProps, Position } from 'reactflow';
import { Box, Text } from '@chakra-ui/react';
import { ElectricalComponentNode } from '../types';
import { getUnit } from '../utils';
import BatteryIcon from '../icons/Battery';
import Terminal from './Terminal';

const Battery = ({ data, selected }: NodeProps<ElectricalComponentNode>) => {
  const { value, type } = data;
  const unit = getUnit(type);
  
  return (
    <Box>
      <BatteryIcon height={48} />
      <Text 
        fontSize="xxsmall" 
        position="absolute" 
        top={22}
        left={14}
        color="white"
      >
        {value}{unit}
      </Text>
      
      <Terminal 
        type="source" 
        position={Position.Top} 
        id="left" 
        style={{ left: 9, top: 2 }}
      />
      <Terminal 
        type="source" 
        position={Position.Top} 
        id="right" 
        style={{ left: 39, top: 2 }}
      />
    </Box>
  );
};

export default Battery;
```

Register these node types in the main workflow component:

```jsx
// In workflow component
const nodeTypes = {
  electricalComponent: ElectricalComponent,
  bulb: Bulb,
  battery: Battery,
  board: Board
};

<ReactFlow
  nodeTypes={nodeTypes}
  connectionMode={ConnectionMode.Loose}
  // other props
/>
```

## Custom Edges with Animations

Create a custom wire component for edges:

```tsx
// Wire.tsx
import { getBezierPath, BaseEdge, EdgeProps } from 'reactflow';

const Wire = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd
}: EdgeProps) => {
  const path = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  });

  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={{ stroke: 'url(#wire)' }} />
      
      {/* Animation */}
      <circle
        r={4}
        fill="yellow"
        style={{ filter: 'drop-shadow(0px 0px 2px #FFC300)' }}
      >
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          path={path}
        />
      </circle>
      
      {/* Glowing effect */}
      <circle
        stroke="yellow"
        strokeWidth={2}
        fill="transparent"
      >
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          path={path}
        />
        <animate
          attributeName="r"
          values="2;6"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </>
  );
};

export default Wire;
```

Register the edge type and add gradient definitions:

```jsx
// In workflow component
const edgeTypes = {
  wire: Wire
};

<ReactFlow
  edgeTypes={edgeTypes}
  // other props
>
  <svg>
    <defs>
      <linearGradient id="wire">
        <stop offset="0%" stopColor="#ECF002" />
        <stop offset="100%" stopColor="#F69900" />
      </linearGradient>
    </defs>
  </svg>
</ReactFlow>
```

Update the `onConnect` function to use the custom edge type:

```jsx
const onConnect = useCallback((params) => {
  setEdges(prev => addEdge({
    ...params,
    type: 'wire',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FFC300'
    }
  }, prev));
}, [setEdges]);
```

## Custom Handles

Create a custom terminal component:

```tsx
// Terminal.tsx
import { Handle, HandleProps } from 'reactflow';

const Terminal = (props: HandleProps) => {
  return (
    <Handle 
      {...props}
      className="terminal"
    />
  );
};

export default Terminal;

// Add CSS in index.css
.terminal {
  width: 8px;
  height: 8px;
  background: white;
  border: 1px solid black;
}

.react-flow__handle.connecting-to {
  background: red;
}

.react-flow__handle.connecting-to.valid {
  background: #55DD99;
}
```

## Connection Validation

Add connection validation to prevent self-connections:

```jsx
// In workflow component
const isValidConnection = useCallback((connection) => {
  const { source, target } = connection;
  return source !== target; // Prevent self connections
}, []);

<ReactFlow
  isValidConnection={isValidConnection}
  // other props
/>
```

Create a custom connection line to show validation status:

```tsx
// ConnectionLine.tsx
import { getSmoothStepPath, ConnectionLineComponentProps } from 'reactflow';

const ConnectionLine = ({ 
  fromX, 
  fromY, 
  toX, 
  toY, 
  connectionStatus 
}: ConnectionLineComponentProps) => {
  const d = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY
  });

  let color = 'black';
  if (connectionStatus === 'valid') {
    color = '#55DD99';
  } else if (connectionStatus === 'invalid') {
    color = '#FF6060';
  }

  return (
    <path
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      d={d}
    />
  );
};

export default ConnectionLine;
```

## Component Panel

Add a panel to drag components onto the circuit:

```jsx
// In workflow component
const dragOutsideRef = useRef<ElectricalComponentType | null>(null);

const onDragStart = (event: React.DragEvent<HTMLButtonElement>, type: ElectricalComponentType) => {
  dragOutsideRef.current = type;
  event.dataTransfer.effectAllowed = 'move';
};

const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  
  const type = dragOutsideRef.current;
  if (!type) return;
  
  const position = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY
  });
  
  let node;
  
  if ([
    ElectricalComponentType.RESISTOR,
    ElectricalComponentType.CAPACITOR,
    ElectricalComponentType.INDUCTOR
  ].includes(type)) {
    node = {
      id: uuidv4(),
      type: 'electricalComponent',
      position,
      data: { type, value: 3 }
    };
  } else if (type === ElectricalComponentType.BULB) {
    node = {
      id: uuidv4(),
      type: 'bulb',
      position,
      data: { type, value: 12 }
    };
  } else if (type === ElectricalComponentType.BATTERY) {
    node = {
      id: uuidv4(),
      type: 'battery',
      position,
      data: { type, value: 12 }
    };
  } else if (type === ElectricalComponentType.BOARD) {
    node = {
      id: uuidv4(),
      type: 'board',
      position,
      data: { type },
      style: { height: 200, width: 200 }
    };
  }
  
  if (node) {
    setNodes(prev => [...prev, node]);
  }
};

// Add panel to ReactFlow
<Panel position="top-right" style={{ 
  border: '1px solid #CCC',
  padding: 12,
  borderRadius: 12,
  background: 'white',
  width: 150
}}>
  <Flex direction="column" gap={2}>
    <div>
      <Text fontSize="xsmall">Components</Text>
      <Flex mt={1} gap={1} flexWrap="wrap">
        {components.map(component => (
          <IconButton
            key={component.label}
            aria-label={component.label}
            icon={component.icon}
            size="sm"
            draggable
            onDragStart={(e) => onDragStart(e, component.type)}
          />
        ))}
      </Flex>
    </div>
    <div>
      <Text fontSize="xsmall">Project</Text>
      <Flex mt={1} gap={1}>
        <IconButton
          aria-label="save"
          icon={<Save />}
          size="xs"
          onClick={onSave}
        />
        {/* Download button will be added later */}
      </Flex>
    </div>
  </Flex>
</Panel>
```

## Component Details Form

Create a form to edit selected component properties:

```tsx
// ComponentDetail.tsx
import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Box, Heading, Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import { ElectricalComponentNode } from '../types';
import { getUnit } from '../utils';

type Props = {
  node: ElectricalComponentNode;
};

const ComponentDetail = ({ node }: Props) => {
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState<string>((node.data.value || 0).toString());
  
  const nodeType = node.data.type || node.type;
  const unit = getUnit(nodeType);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value ? Number(e.target.value) : 0;
    setValue(e.target.value);
    updateNodeData(node.id, { value: newValue });
  };
  
  return (
    <Box>
      <Heading fontSize="xs">{nodeType.toUpperCase()}</Heading>
      {node.data.value !== undefined && (
        <InputGroup size="sm" my={2}>
          <Input 
            value={value}
            onChange={handleChange}
          />
          <InputRightAddon>{unit}</InputRightAddon>
        </InputGroup>
      )}
    </Box>
  );
};

export default ComponentDetail;
```

Add the form to the workflow:

```jsx
// In workflow component
const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

const onNodeClick = (event: React.MouseEvent, node: Node) => {
  setSelectedNode(node);
};

const onPaneClick = () => {
  setSelectedNode(undefined);
};

<ReactFlow
  onNodeClick={onNodeClick}
  onPaneClick={onPaneClick}
  // other props
>
  {/* Other components */}
  
  {selectedNode && (
    <Flex
      position="absolute"
      top={0}
      left={0}
      height="100%"
      width="150px"
      alignItems="center"
      background="transparent"
      marginLeft={12}
    >
      <Box
        background="white"
        border="1px solid #CCC"
        borderRadius={12}
        height={150}
        width="100%"
        padding={12}
        marginBottom={50}
        position="relative"
        zIndex={1000}
      >
        <ComponentDetail 
          node={selectedNode} 
          key={selectedNode.id} 
        />
      </Box>
    </Flex>
  )}
</ReactFlow>
```

## Edge Reconnection & Deletion

Implement edge reconnection and deletion functionality:

```jsx
// In workflow component
const edgeReconnectSuccessful = useRef(false);

const onReconnectStart = () => {
  edgeReconnectSuccessful.current = false;
};

const onReconnect = ({ edge, newConnection }) => {
  edgeReconnectSuccessful.current = true;
  setEdges(prevEdges => 
    reconnectEdge(edge, newConnection, prevEdges)
  );
};

const onReconnectEnd = (event: MouseEvent | TouchEvent, edge: Edge) => {
  if (!edgeReconnectSuccessful.current) {
    setEdges(prevEdges => 
      prevEdges.filter(e => e.id !== edge.id)
    );
  }
};

<ReactFlow
  onReconnectStart={onReconnectStart}
  onReconnect={onReconnect}
  onReconnectEnd={onReconnectEnd}
  // other props
/>
```

## Node Rotation

Create a rotation handle component:

```tsx
// Rotation.tsx
import { useRef, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';

type Props = {
  selected?: boolean;
  id: string;
};

const Rotation = ({ selected, id }: Props) => {
  const rotatorRef = useRef<HTMLDivElement | null>(null);
  const { updateNodeData, updateNodeInternals } = useReactFlow();
  
  useEffect(() => {
    if (!rotatorRef.current || !selected) return;
    
    const selection = select(rotatorRef.current);
    
    const dragHandler = drag().on('drag', (event) => {
      // Calculate angle based on mouse position
      const dx = event.x - 100;
      const dy = event.y - 100;
      
      // Convert to radians and then to degrees
      const radians = Math.atan2(dy, dx);
      const degrees = radians * (180 / Math.PI);
      const rotation = 180 - degrees;
      
      // Snap to perpendicular angles
      const perpendicularAngles = [0, 90, 180, 270, 360];
      const perpendicularRotation = perpendicularAngles.find(
        angle => Math.abs(angle - rotation) <= 45 || Math.abs(angle + rotation) <= 45
      );
      
      updateNodeData(id, { rotation: perpendicularRotation });
      updateNodeInternals(id);
    });
    
    selection.call(dragHandler);
    
    return () => {
      selection.on('.drag', null);
    };
  }, [id, selected, updateNodeData, updateNodeInternals]);
  
  if (!selected) return null;
  
  return (
    <div
      ref={rotatorRef}
      style={{
        position: 'absolute',
        width: 10,
        height: 10,
        background: '#3376D9',
        left: '50%',
        top: -30,
        borderRadius: '100%',
        transform: 'translate(-50%, 120%)',
        cursor: 'pointer',
      }}
    />
  );
};

export default Rotation;
```

Add the rotation handle to the ElectricalComponent:

```jsx
// In ElectricalComponent.tsx
import Rotation from './Rotation';

// Inside the component
<Box position="relative">
  {/* Existing content */}
  <Rotation selected={selected} id={id} />
</Box>
```

## Clean Detection and Aggregation

Implement node merging when dropping one node onto another of the same type:

```jsx
// In workflow component
const onNodeDrag = (event: MouseEvent, dragNode: Node) => {
  const overlappingNode = getIntersectingNodes(dragNode)[0];
  
  setNodes(prevNodes => prevNodes.map(node => {
    if (node.id === dragNode.id) {
      const state = overlappingNode && 
        ['capacitor', 'resistor', 'inductor'].includes(overlappingNode.data.type) && 
        overlappingNode.data.type === dragNode.data.type 
          ? ElectricalComponentState.ADD 
          : ElectricalComponentState.NOT_ADD;
          
      return {
        ...node,
        data: {
          ...node.data,
          state
        }
      };
    }
    return node;
  }));
};

const overlappingNodeRef = useRef<Node | null>(null);

const onNodeDragStop = (event: MouseEvent, dragNode: Node) => {
  const overlappingNode = getIntersectingNodes(dragNode)[0];
  overlappingNodeRef.current = overlappingNode;
  
  if (overlappingNode?.data.type &&
      ['capacitor', 'resistor', 'inductor'].includes(overlappingNode.data.type) &&
      dragNode.data.type === overlappingNode.data.type) {
    
    setNodes(prevNodes => {
      // Update the value of the overlapping node
      const updatedNodes = prevNodes.map(node => {
        if (node.id === overlappingNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              value: (dragNode.data.value as number) + (node.data.value as number)
            }
          };
        }
        return node;
      });
      
      // Remove the dragged node
      return updatedNodes.filter(node => node.id !== dragNode.id);
    });
  }
};

<ReactFlow
  onNodeDrag={onNodeDrag}
  onNodeDragStop={onNodeDragStop}
  // other props
/>
```

## Node Grouping

Create a board component for grouping nodes:

```tsx
// Board.tsx
import { NodeProps } from 'reactflow';
import { Box } from '@chakra-ui/react';

type BoardNode = {
  data: {
    type: string;
  };
};

const Board = ({ selected }: NodeProps<BoardNode>) => {
  return (
    <Box
      border="2px solid black"
      borderRadius={8}
      height="100%"
      width="100%"
      boxShadow={selected ? 'black 0px 0px 4px' : undefined}
    />
  );
};

export default Board;
```

Add grouping logic to the `onNodeDragStop` function:

```jsx
// In onNodeDragStop function
// Check if the node is being dropped on a board
if (overlappingNodeRef.current?.type === 'board') {
  setNodes(prevNodes => {
    // Find the board node to position the child node relative to it
    const boardNode = overlappingNodeRef.current;
    const { x = 0, y = 0 } = boardNode.position || {};
    
    // Get the dragged node positions
    const { x: dragX = 0, y: dragY = 0 } = dragNode.position || {};
    
    // Calculate new position relative to the board
    const position = {
      x: dragX - x,
      y: dragY - y
    };
    
    // Update all nodes, adding the parentId to the dragged node
    return [
      // Place the board first in the array (important!)
      overlappingNodeRef.current,
      ...prevNodes
        .filter(node => node.id !== overlappingNodeRef.current.id)
        .map(node => {
          if (node.id === dragNode.id) {
            return {
              ...node,
              position: !dragNode.parentId ? position : node.position,
              parentId: boardNode.id
            };
          }
          return node;
        })
    ];
  });
}

// Remove node from group when dragged outside
if ((!overlappingNodeRef.current || 
     overlappingNodeRef.current.type !== 'board') && 
    dragNode.parentId) {
  
  setNodes(prevNodes => {
    // Find the parent board to adjust position
    const board = prevNodes.find(node => node.id === dragNode.parentId);
    
    if (board) {
      const { x = 0, y = 0 } = board.position || {};
      const { x: dragX = 0, y: dragY = 0 } = dragNode.position || {};
      
      // Position the node absolute to the flow when removing from group
      const position = {
        x: dragX + x,
        y: dragY + y
      };
      
      return prevNodes.map(node => {
        if (node.id === dragNode.id) {
          return {
            ...node,
            position,
            parentId: undefined
          };
        }
        return node;
      });
    }
    
    return prevNodes;
  });
}
```

Add a lock/unlock functionality to constrain nodes within a group:

```jsx
// In ElectricalComponent.tsx
import { Lock, Unlock } from 'react-bootstrap-icons';

// Inside the component, add this after the Terminals
{parentId && selected && (
  <div
    style={{
      position: 'absolute',
      top: -23,
      right: 20,
      color: 'black'
    }}
    onClick={() => {
      updateNode(id, (prevNode) => ({
        extent: prevNode.extent === 'parent' ? undefined : 'parent',
        data: {
          ...prevNode.data,
          isAttachedToGroup: !prevNode.data.isAttachedToGroup
        }
      }));
    }}
  >
    {isAttachedToGroup ? <Lock /> : <Unlock />}
  </div>
)}
```

## Resizing Nodes

Add resizing capability to the board node:

```jsx
// In Board.tsx
import { NodeResizer } from 'reactflow';

// Inside the component
return (
  <>
    {selected && (
      <NodeResizer 
        minWidth={200} 
        minHeight={200} 
      />
    )}
    <Box
      // existing props
    />
  </>
);
```

## Contextual Zoom

Create a placeholder component to show when zoomed out:

```tsx
// Placeholder.tsx
import { Box } from '@chakra-ui/react';
import { useStore } from 'reactflow';

// Zoom selector function to determine when to show placeholder
export const zoomSelector = (state) => {
  return state.transform[2] < 0.7;
};

const Placeholder = () => {
  const showContent = useStore(zoomSelector);
  
  if (!showContent) return null;
  
  // Common props for placeholder boxes
  const props = {
    background: '#eee',
    position: 'relative',
    width: '100%',
    flex: 1
  };
  
  return (
    <Box
      padding={3}
      position="relative"
      zIndex={1}
      background="white"
      display="flex"
      flexDirection="column"
      gap={2}
      borderRadius={8}
      height="100%"
    >
      <div {...props} />
      <div {...props} />
      <div {...props} />
      <div {...props} />
      <div {...props} />
      <div {...props} />
    </Box>
  );
};

export default Placeholder;
```

Add visibility logic in the workflow:

```jsx
// In workflow component
import { zoomSelector } from './components/Placeholder';

const showContent = useStore(zoomSelector);

// Use an effect to update node properties based on zoom level
useEffect(() => {
  setNodes(prevNodes => prevNodes.map(node => {
    if (node.parentId) {
      return {
        ...node,
        draggable: showContent,
        selectable: showContent,
        data: {
          ...node.data,
          visible: showContent,
          connectable: showContent
        }
      };
    }
    return node;
  }));
}, [showContent, setNodes]);
```

Add the placeholder to the Board component:

```jsx
// In Board.tsx
import Placeholder from './Placeholder';
import { useStore } from 'reactflow';
import { zoomSelector } from '../utils';

// Inside the component
const showContent = useStore(zoomSelector);

return (
  <>
    {selected && (
      <NodeResizer 
        minWidth={200} 
        minHeight={200} 
      />
    )}
    <Box
      // existing props
    >
      {!showContent && <Placeholder />}
    </Box>
  </>
);
```

## Keyboard Shortcuts

Create a custom hook for keyboard shortcuts:

```tsx
// hooks/useKeyBindings.ts
import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

const useKeyBindings = () => {
  const { setNodes, getNodes } = useReactFlow();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

## Keyboard Shortcuts (continued)

Create a custom hook for keyboard shortcuts:

```tsx
// hooks/useKeyBindings.ts
import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

const useKeyBindings = () => {
  const { setNodes, getNodes } = useReactFlow();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      switch(key) {
        case 'delete':
          setNodes(prevNodes => 
            prevNodes.filter(node => !node.selected)
          );
          break;
          
        case 'd':
          if (e.ctrlKey) {
            const selectedNode = getNodes().find(node => node.selected);
            
            if (!selectedNode) return;
            
            setNodes(prevNodes => [
              ...prevNodes.map(node => 
                node.selected ? { ...node, selected: false } : node
              ),
              {
                ...selectedNode,
                id: uuidv4(),
                position: {
                  x: selectedNode.position.x + 40,
                  y: selectedNode.position.y + 40
                },
                selected: true
              }
            ]);
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setNodes, getNodes]);
};

export default useKeyBindings;
```

Add the hook to the workflow:

```jsx
// In workflow component
import useKeyBindings from '../hooks/useKeyBindings';

const Workflow = () => {
  // existing code
  useKeyBindings();
  
  // rest of the component
};
```

## Saving and Loading Projects

Implement project saving and loading using an API:

```tsx
// In workflow component
import { useReactFlowInstance } from 'reactflow';

const [rfInstance, setRfInstance] = useState(null);
const { mutate: saveFlow, isLoading } = useSaveData();
const { data: reactFlowState } = useGetData();

const onSave = async () => {
  if (rfInstance) {
    const flow = rfInstance.toObject();
    saveFlow(flow);
  }
};

// Load saved state when app starts
useEffect(() => {
  if (reactFlowState) {
    setNodes(reactFlowState.nodes || []);
    setEdges(reactFlowState.edges || []);
    
    const { x = 0, y = 0, zoom = 1 } = reactFlowState.viewport || {};
    setViewport({ x, y, zoom });
  }
}, [reactFlowState, setNodes, setEdges, setViewport]);

<ReactFlow
  onInit={setRfInstance}
  // other props
/>
```

Add a save button in the panel:

```jsx
<IconButton
  aria-label="save"
  icon={isLoading ? <Spinner size="xs" /> : <Save />}
  size="xs"
  onClick={onSave}
/>
```

## Generating Images

Create a download button component:

```tsx
// DownloadButton.tsx
import { useCallback } from 'react';
import { useReactFlow, getNodesBounds, getViewportForBounds } from 'reactflow';
import { IconButton } from '@chakra-ui/react';
import { Download } from 'react-bootstrap-icons';
import { toPng } from 'html-to-image';

const DownloadButton = () => {
  const { getNodes } = useReactFlow();
  
  const onDownload = useCallback(() => {
    // Get the dimensions based on node positions
    const nodesBounds = getNodesBounds(getNodes());
    
    // Define image dimensions
    const imageWidth = 1024;
    const imageHeight = 768;
    
    // Get the appropriate viewport based on node positions
    const { x, y, zoom } = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      100
    );
    
    // Get the ReactFlow DOM element
    const reactFlowElement = document.querySelector('.react-flow__viewport');
    if (!reactFlowElement) return;
    
    // Generate the image
    toPng(reactFlowElement as HTMLElement, {
      backgroundColor: 'white',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${x}px, ${y}px) scale(${zoom})`
      }
    })
    .then((dataUrl) => {
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'electrical-circuit.png';
      link.click();
    });
  }, [getNodes]);
  
  return (
    <IconButton
      aria-label="download"
      icon={<Download />}
      size="xs"
      onClick={onDownload}
    />
  );
};

export default DownloadButton;
```

Add the download button to the panel:

```jsx
<Flex mt={1} gap={1}>
  <IconButton
    aria-label="save"
    icon={isLoading ? <Spinner size="xs" /> : <Save />}
    size="xs"
    onClick={onSave}
  />
  <DownloadButton />
</Flex>
```

## Utils and Helper Functions

Create utility functions:

```tsx
// utils.ts
import { ElectricalComponentType, ReactFlowState } from './types';

// Get unit based on component type
export const getUnit = (type: ElectricalComponentType): string => {
  switch (type) {
    case 'resistor':
      return 'Ω';
    case 'capacitor':
      return 'μF';
    case 'inductor':
      return 'H';
    case 'bulb':
      return 'W';
    case 'battery':
      return 'V';
    default:
      return '';
  }
};

// Check if a point is inside a box
export const isPointInBox = (
  point: { x: number, y: number },
  box: { x: number, y: number, width: number, height: number }
) => {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  );
};

// Zoom selector for contextual zoom
export const zoomSelector = (state: ReactFlowState) => {
  return state.transform[2] >= 0.7;
};
```

## Final Main Workflow Component Structure

Here's the overall structure of the main workflow component:

```tsx
// Workflow.tsx
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Panel,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useStore,
  MarkerType,
  addEdge,
  getNodesBounds,
  getViewportForBounds,
  Node,
  Edge
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { Box, Flex, Text, IconButton, Spinner } from '@chakra-ui/react';
import { Save } from 'react-bootstrap-icons';
import { useGetData, useSaveData } from '../api/api';
import { ElectricalComponentType, ElectricalComponentState } from '../types';
import { zoomSelector, isPointInBox } from '../utils';
import { components } from '../constants';

// Import components
import ElectricalComponent from '../components/ElectricalComponent';
import Bulb from '../components/Bulb';
import Battery from '../components/Battery';
import Board from '../components/Board';
import Wire from '../components/Wire';
import ConnectionLine from '../components/ConnectionLine';
import Terminal from '../components/Terminal';
import ComponentDetail from '../components/ComponentDetail';
import DownloadButton from '../components/DownloadButton';
import useKeyBindings from '../hooks/useKeyBindings';

const Workflow = () => {
  // Node and edge states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // ReactFlow instance for saving/loading
  const [rfInstance, setRfInstance] = useState(null);
  
  // Selected node for detail form
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);
  
  // Refs
  const dragOutsideRef = useRef<ElectricalComponentType | null>(null);
  const edgeReconnectSuccessful = useRef(false);
  const overlappingNodeRef = useRef<Node | null>(null);
  
  // Get ReactFlow utilities
  const { getNodes, getIntersectingNodes, setViewport, screenToFlowPosition } = useReactFlow();
  
  // Contextual zoom
  const showContent = useStore(zoomSelector);
  
  // API hooks
  const { mutate: saveFlow, isLoading } = useSaveData();
  const { data: reactFlowState } = useGetData();
  
  // Load saved state when app starts
  useEffect(() => {
    if (reactFlowState) {
      setNodes(reactFlowState.nodes || []);
      setEdges(reactFlowState.edges || []);
      
      const { x = 0, y = 0, zoom = 1 } = reactFlowState.viewport || {};
      setViewport({ x, y, zoom });
    }
  }, [reactFlowState, setNodes, setEdges, setViewport]);
  
  // Update node properties based on zoom level
  useEffect(() => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.parentId) {
        return {
          ...node,
          draggable: showContent,
          selectable: showContent,
          data: {
            ...node.data,
            visible: showContent,
            connectable: showContent
          }
        };
      }
      return node;
    }));
  }, [showContent, setNodes]);
  
  // Node types
  const nodeTypes = {
    electricalComponent: ElectricalComponent,
    bulb: Bulb,
    battery: Battery,
    board: Board
  };
  
  // Edge types
  const edgeTypes = {
    wire: Wire
  };
  
  // Handle connections
  const onConnect = useCallback((params) => {
    setEdges(prev => addEdge({
      ...params,
      type: 'wire',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#FFC300'
      }
    }, prev));
  }, [setEdges]);
  
  // Save project
  const onSave = async () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      saveFlow(flow);
    }
  };
  
  // Validate connections
  const isValidConnection = useCallback((connection) => {
    const { source, target } = connection;
    return source !== target; // Prevent self connections
  }, []);
  
  // Handle node drag (for clean detection)
  const onNodeDrag = (event: MouseEvent, dragNode: Node) => {
    const overlappingNode = getIntersectingNodes(dragNode)[0];
    
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === dragNode.id) {
        const state = overlappingNode && 
          ['capacitor', 'resistor', 'inductor'].includes(overlappingNode.data.type) && 
          overlappingNode.data.type === dragNode.data.type 
            ? ElectricalComponentState.ADD 
            : ElectricalComponentState.NOT_ADD;
            
        return {
          ...node,
          data: {
            ...node.data,
            state
          }
        };
      }
      return node;
    }));
  };
  
  // Handle node drag stop (for clean detection and grouping)
  const onNodeDragStop = (event: MouseEvent, dragNode: Node) => {
    const overlappingNode = getIntersectingNodes(dragNode)[0];
    overlappingNodeRef.current = overlappingNode;
    
    // Clean detection - merge nodes of same type
    if (overlappingNode?.data.type &&
        ['capacitor', 'resistor', 'inductor'].includes(overlappingNode.data.type) &&
        dragNode.data.type === overlappingNode.data.type) {
      
      setNodes(prevNodes => {
        // Update the value of the overlapping node
        const updatedNodes = prevNodes.map(node => {
          if (node.id === overlappingNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                value: (dragNode.data.value as number) + (node.data.value as number)
              }
            };
          }
          return node;
        });
        
        // Remove the dragged node
        return updatedNodes.filter(node => node.id !== dragNode.id);
      });
    }
    
    // Grouping - add to board
    if (overlappingNode?.type === 'board') {
      setNodes(prevNodes => {
        // Find the board node to position the child node relative to it
        const boardNode = overlappingNode;
        const { x = 0, y = 0 } = boardNode.position || {};
        
        // Get the dragged node positions
        const { x: dragX = 0, y: dragY = 0 } = dragNode.position || {};
        
        // Calculate new position relative to the board
        const position = {
          x: dragX - x,
          y: dragY - y
        };
        
        // Update all nodes, adding the parentId to the dragged node
        return [
          // Place the board first in the array (important!)
          overlappingNode,
          ...prevNodes
            .filter(node => node.id !== overlappingNode.id)
            .map(node => {
              if (node.id === dragNode.id) {
                return {
                  ...node,
                  position: !dragNode.parentId ? position : node.position,
                  parentId: boardNode.id,
                  data: {
                    ...node.data,
                    visible: showContent,
                    connectable: showContent
                  },
                  draggable: showContent,
                  selectable: showContent
                };
              }
              return node;
            })
        ];
      });
    }
    
    // Remove node from group when dragged outside
    if ((!overlappingNode || 
       overlappingNode.type !== 'board') && 
      dragNode.parentId) {
      
      setNodes(prevNodes => {
        // Find the parent board to adjust position
        const board = prevNodes.find(node => node.id === dragNode.parentId);
        
        if (board) {
          const { x = 0, y = 0 } = board.position || {};
          const { x: dragX = 0, y: dragY = 0 } = dragNode.position || {};
          
          // Position the node absolute to the flow when removing from group
          const position = {
            x: dragX + x,
            y: dragY + y
          };
          
          return prevNodes.map(node => {
            if (node.id === dragNode.id) {
              return {
                ...node,
                position,
                parentId: undefined
              };
            }
            return node;
          });
        }
        
        return prevNodes;
      });
    }
  };
  
  // Handle node selection
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };
  
  // Handle pane click (deselect node)
  const onPaneClick = () => {
    setSelectedNode(undefined);
  };
  
  // Handle edge reconnection
  const onReconnectStart = () => {
    edgeReconnectSuccessful.current = false;
  };
  
  const onReconnect = ({ edge, newConnection }) => {
    edgeReconnectSuccessful.current = true;
    setEdges(prevEdges => 
      reconnectEdge(edge, newConnection, prevEdges)
    );
  };
  
  const onReconnectEnd = (event: MouseEvent | TouchEvent, edge: Edge) => {
    if (!edgeReconnectSuccessful.current) {
      setEdges(prevEdges => 
        prevEdges.filter(e => e.id !== edge.id)
      );
    }
  };
  
  // Handle drag and drop from component panel
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, type: ElectricalComponentType) => {
    dragOutsideRef.current = type;
    event.dataTransfer.effectAllowed = 'move';
  };
  
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    const type = dragOutsideRef.current;
    if (!type) return;
    
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    });
    
    let node;
    
    if ([
      ElectricalComponentType.RESISTOR,
      ElectricalComponentType.CAPACITOR,
      ElectricalComponentType.INDUCTOR
    ].includes(type)) {
      node = {
        id: uuidv4(),
        type: 'electricalComponent',
        position,
        data: { type, value: 3 }
      };
    } else if (type === ElectricalComponentType.BULB) {
      node = {
        id: uuidv4(),
        type: 'bulb',
        position,
        data: { type, value: 12 }
      };
    } else if (type === ElectricalComponentType.BATTERY) {
      node = {
        id: uuidv4(),
        type: 'battery',
        position,
        data: { type, value: 12 }
      };
    } else if (type === ElectricalComponentType.BOARD) {
      node = {
        id: uuidv4(),
        type: 'board',
        position,
        data: { type },
        style: { height: 200, width: 200 }
      };
    }
    
    // Check if node is being dropped onto a board
    const boards = nodes.filter(node => node.type === 'board');
    const board = boards.find(board => 
      isPointInBox(
        { x: position.x, y: position.y },
        { 
          x: board.position.x, 
          y: board.position.y, 
          width: board.style?.width || 0, 
          height: board.style?.height || 0 
        }
      )
    );
    
    if (board && node) {
      // Adjust position to be relative to the board
      const { x, y } = board.position;
      const position = {
        x: node.position.x - x,
        y: node.position.y - y
      };
      
      node.position = position;
      node.parentId = board.id;
      node.draggable = showContent;
      node.selectable = showContent;
      
      if (node.data) {
        node.data.visible = showContent;
        node.data.connectable = showContent;
      }
    }
    
    if (node) {
      setNodes(prev => [...prev, node]);
    }
  };
  
  // Use keyboard shortcuts
  useKeyBindings();
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionLineComponent={ConnectionLine}
      connectionMode={ConnectionMode.Loose}
      isValidConnection={isValidConnection}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onReconnectStart={onReconnectStart}
      onReconnect={onReconnect}
      onReconnectEnd={onReconnectEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onInit={setRfInstance}
      fitView
    >
      <Background
        variant={BackgroundVariant.Lines}
        gap={10}
        color="#F1F1F1"
        id="1"
      />
      <Background
        variant={BackgroundVariant.Lines}
        gap={100}
        color="#CCC"
        id="2"
      />
      
      <svg>
        <defs>
          <linearGradient id="wire">
            <stop offset="0%" stopColor="#ECF002" />
            <stop offset="100%" stopColor="#F69900" />
          </linearGradient>
        </defs>
      </svg>
      
      <Panel position="top-right" style={{ 
        border: '1px solid #CCC',
        padding: 12,
        borderRadius: 12,
        background: 'white',
        width: 150
      }}>
        <Flex direction="column" gap={2}>
          <div>
            <Text fontSize="xsmall">Project</Text>
            <Flex mt={1} gap={1}>
              <IconButton
                aria-label="save"
                icon={isLoading ? <Spinner size="xs" /> : <Save />}
                size="xs"
                onClick={onSave}
              />
              <DownloadButton />
            </Flex>
          </div>
          <div>
            <Text fontSize="xsmall">Components</Text>
            <Flex mt={1} gap={1} flexWrap="wrap">
              {components.map(component => (
                <IconButton
                  key={component.label}
                  aria-label={component.label}
                  icon={component.icon}
                  size="sm"
                  draggable
                  onDragStart={(e) => onDragStart(e, component.type)}
                />
              ))}
            </Flex>
          </div>
        </Flex>
      </Panel>
      
      {selectedNode && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          height="100%"
          width="150px"
          alignItems="center"
          background="transparent"
          marginLeft={12}
        >
          <Box
            background="white"
            border="1px solid #CCC"
            borderRadius={12}
            height={150}
            width="100%"
            padding={12}
            marginBottom={50}
            position="relative"
            zIndex={1000}
          >
            <ComponentDetail 
              node={selectedNode} 
              key={selectedNode.id} 
            />
          </Box>
        </Flex>
      )}
    </ReactFlow>
  );
};

export default Workflow;
```

## Conclusion

This tutorial has guided you through creating an advanced electrical diagram maker using React Flow. You've learned how to:

1. Create custom nodes and edges for electrical components
2. Implement custom handles with validation
3. Add interactive features like node rotation and resizing
4. Implement clean detection for merging similar components
5. Create grouping functionality with constraints
6. Implement contextual zooming with placeholders
7. Add keyboard shortcuts for deleting and duplicating nodes
8. Save and load project states
9. Generate images of your diagrams

With these advanced React Flow techniques, you can build sophisticated diagramming applications and adapt these principles to other domains beyond electrical diagrams.
