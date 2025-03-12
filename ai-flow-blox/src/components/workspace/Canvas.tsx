
import React, { useCallback, useRef, useState } from 'react';
import Node from './Node';
import Connection from './Connection';
import useWorkflowStore from '@/lib/store';
import AddNodeButton from './AddNodeButton';
import { NodeType } from '@/lib/types';

const DynamicConnection: React.FC = () => {
  const { currentConnection, nodes } = useWorkflowStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current && currentConnection) {
      const rect = svgRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [currentConnection]);
  
  if (!currentConnection) return null;
  
  const sourceNode = nodes.find(node => node.id === currentConnection.sourceId);
  if (!sourceNode) return null;
  
  const sourceX = sourceNode.position.x + 128; // Half of node width
  const sourceY = sourceNode.position.y + 140; // Bottom of node
  
  const midX = (sourceX + mousePosition.x) / 2;
  const path = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${mousePosition.y}, ${mousePosition.x} ${mousePosition.y}`;
  
  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: 'visible' }}
      ref={svgRef}
      onMouseMove={handleMouseMove}
    >
      <path d={path} className="connection-line" strokeWidth={2} stroke="#64748b" fill="none" strokeDasharray="4 2" />
    </svg>
  );
};

const Canvas: React.FC = () => {
  const {
    nodes,
    connections,
    addNode,
    selectNode,
    setCurrentConnection,
    currentConnection
  } = useWorkflowStore();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (canvasRef.current && currentConnection) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mousePosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setCurrentConnection({
        ...currentConnection,
        position: mousePosition
      });
    }
  }, [currentConnection, setCurrentConnection]);
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'path') {
      return;
    }
    
    selectNode(null);
    
    if (currentConnection) {
      setCurrentConnection(null);
    }
  };
  
  // Check if workflow has an output node
  const hasOutputNode = nodes.some(node => node.type === 'output');
  
  // If we have no nodes, add a placeholder for the first node
  if (nodes.length === 0) {
    return (
      <div 
        ref={canvasRef}
        className="canvas relative flex flex-col items-center justify-center w-full h-full"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      >
        <div className="flex flex-col items-center">
          <div className="text-muted-foreground mb-4">Start your workflow by adding a node</div>
          <AddNodeButton
            onSelectNodeType={(type) => {
              addNode(type, { x: window.innerWidth / 2 - 128, y: 200 }, `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`);
            }}
          />
        </div>
      </div>
    );
  }

  // Sort nodes by their vertical position for a top-down flow
  const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);

  return (
    <div
      ref={canvasRef}
      className="canvas relative overflow-auto w-full h-full flex flex-col items-center pt-16 pb-32"
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
    >
      {/* Render connections */}
      {connections.map((connection) => (
        <Connection key={connection.id} connection={connection} nodes={nodes} />
      ))}
      
      {/* Dynamic connection while dragging */}
      <DynamicConnection />
      
      {/* Render nodes in vertical flow */}
      <div className="flex flex-col items-center gap-8">
        {sortedNodes.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center">
            <Node node={node} isFirst={index === 0} />
            
            {/* Only show add button if it's not after an output node and not the last node */}
            {!hasOutputNode && (index === sortedNodes.length - 1) && (
              <div className="mt-8">
                <AddNodeButton
                  onSelectNodeType={(type) => {
                    const lastNode = sortedNodes[sortedNodes.length - 1];
                    const newY = lastNode.position.y + 200; // 200px below the last node
                    
                    addNode(
                      type, 
                      { x: window.innerWidth / 2 - 128, y: newY }, 
                      `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`
                    );
                  }}
                />
              </div>
            )}
            
            {/* Connector line to next node if not the last node */}
            {index < sortedNodes.length - 1 && (
              <div className="w-1 h-12 bg-border/80 my-2 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
