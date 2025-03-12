
import React, { useMemo } from 'react';
import { IConnection, INode } from '@/lib/types';
import useWorkflowStore from '@/lib/store';

interface ConnectionProps {
  connection: IConnection;
  nodes: INode[];
}

// Helper function to get connection path for vertical workflow
const getConnectionPath = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
) => {
  const midY = (sourceY + targetY) / 2;
  return `M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;
};

// Get the position of connection points for vertical layout
const getConnectionPoints = (source: INode, target: INode) => {
  // Output handle is at the bottom of source node
  const sourceX = source.position.x + 128; // Half of node width
  const sourceY = source.position.y + 140; // Bottom of the node
  
  // Input handle is at the top of target node
  const targetX = target.position.x + 128; // Half of node width
  const targetY = target.position.y; // Top of the node
  
  return { sourceX, sourceY, targetX, targetY };
};

const Connection: React.FC<ConnectionProps> = ({ connection, nodes }) => {
  const removeConnection = useWorkflowStore((state) => state.removeConnection);
  
  // Find source and target nodes
  const sourceNode = useMemo(
    () => nodes.find((node) => node.id === connection.sourceId),
    [nodes, connection.sourceId]
  );
  
  const targetNode = useMemo(
    () => nodes.find((node) => node.id === connection.targetId),
    [nodes, connection.targetId]
  );
  
  // Don't render if nodes don't exist
  if (!sourceNode || !targetNode) {
    return null;
  }
  
  const { sourceX, sourceY, targetX, targetY } = getConnectionPoints(sourceNode, targetNode);
  const path = getConnectionPath(sourceX, sourceY, targetX, targetY);
  
  // Handle double-click to remove connection
  const handleDoubleClick = () => {
    removeConnection(connection.id);
  };
  
  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: 'visible' }}
    >
      {/* Connection path */}
      <path
        d={path}
        className="connection-line"
        strokeWidth={3}
        stroke="#64748b"
        fill="none"
        onDoubleClick={handleDoubleClick}
        style={{ pointerEvents: 'stroke' }}
      />
      
      {/* Animated dashed line overlay for visual effect */}
      <path
        d={path}
        className="connection-line"
        strokeWidth={3}
        stroke="#64748b"
        fill="none"
        strokeDasharray="6 3"
        strokeOpacity="0.6"
        style={{ 
          pointerEvents: 'none',
          animation: 'dash 30s linear infinite'
        }}
      />
      
      {/* Arrow at the end of the path */}
      <circle
        cx={targetX}
        cy={targetY}
        r={4}
        fill="#64748b"
      />
    </svg>
  );
};

export default Connection;
