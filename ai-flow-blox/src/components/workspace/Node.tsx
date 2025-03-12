
import React, { useRef } from 'react';
import { INode, NodeType } from '@/lib/types';
import useWorkflowStore from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Database, FileInput, FileOutput, X, ChevronRight, User, Mail, Trash2 } from 'lucide-react';

// Node icons by type
const NodeIcons: Record<NodeType, React.ReactNode> = {
  ai: <MessageSquare className="h-5 w-5" />,
  data: <Database className="h-5 w-5" />,
  input: <FileInput className="h-5 w-5" />,
  output: <FileOutput className="h-5 w-5" />
};

// Node colors by type
const NodeColors: Record<NodeType, string> = {
  ai: 'bg-purple-500',
  data: 'bg-blue-500',
  input: 'bg-orange-500', 
  output: 'bg-green-500'
};

interface NodeProps {
  node: INode;
  isFirst?: boolean;
}

const Node: React.FC<NodeProps> = ({ node, isFirst = false }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const {
    removeNode,
    selectNode,
    selectedNodeId,
    setCurrentConnection,
    addConnection,
    currentConnection
  } = useWorkflowStore();
  
  // Handle connections
  const handleInputHandleMouseUp = () => {
    if (currentConnection) {
      addConnection(currentConnection.sourceId, node.id);
    }
  };
  
  const handleOutputHandleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentConnection({
      sourceId: node.id,
      position: {
        x: node.position.x,
        y: node.position.y
      }
    });
  };
  
  const handleOutputHandleMouseUp = () => {
    setCurrentConnection(null);
  };
  
  // Handle node selection
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.id);
  };
  
  // Handle node removal
  const handleRemoveNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNode(node.id);
  };
  
  const isSelected = selectedNodeId === node.id;
  
  const renderNodeContent = () => {
    switch (node.type) {
      case 'ai':
        return (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Type</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Custom</span>
            </div>
            <div className="flex flex-col gap-1 mt-3">
              <span className="text-xs text-muted-foreground">Message</span>
              <div className="bg-background/80 border border-border/50 rounded p-2 text-xs">
                Process user data...
              </div>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Source</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">API</span>
            </div>
            <div className="flex flex-col gap-1 mt-3">
              <span className="text-xs text-muted-foreground">Endpoint</span>
              <div className="bg-background/80 border border-border/50 rounded p-2 text-xs">
                /api/data
              </div>
            </div>
          </div>
        );
      case 'input':
        return (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Input Type</span>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">Text</span>
            </div>
            <div className="flex flex-col gap-1 mt-3">
              <div className="flex gap-2 items-center">
                <User className="h-3 w-3 text-muted-foreground" />
                <div className="bg-background/80 border border-border/50 rounded px-2 py-1 text-xs flex-grow">
                  Name
                </div>
              </div>
              <div className="flex gap-2 items-center mt-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <div className="bg-background/80 border border-border/50 rounded px-2 py-1 text-xs flex-grow">
                  Email
                </div>
              </div>
            </div>
          </div>
        );
      case 'output':
        return (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Output Type</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Message</span>
            </div>
            <div className="flex flex-col gap-1 mt-3">
              <span className="text-xs text-muted-foreground">Template</span>
              <div className="bg-background/80 border border-border/50 rounded p-2 text-xs">
                Hello, {`{{name}}`}!
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      ref={nodeRef}
      className={`node relative bg-card shadow-md rounded-lg border border-border overflow-visible w-64 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      style={{
        opacity: 1,
      }}
      onClick={handleNodeClick}
      layout
      layoutId={`node-${node.id}`}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Node header */}
      <div className={`${NodeColors[node.type]} px-3 py-2 text-white flex items-center justify-between gap-2`}>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">
            {NodeIcons[node.type]}
          </div>
          <h3 className="font-medium text-sm truncate">{node.title}</h3>
        </div>
        <ChevronRight className="h-4 w-4 opacity-70" />
      </div>
      
      {/* Node content */}
      {renderNodeContent()}
      
      {/* Connection handles */}
      <div 
        className="node-handle node-input-handle" 
        onMouseUp={handleInputHandleMouseUp}
      />
      <div 
        className="node-handle node-output-handle" 
        onMouseDown={handleOutputHandleMouseDown}
        onMouseUp={handleOutputHandleMouseUp}
      />
      
      {/* Delete button (only for non-first nodes) */}
      {!isFirst && (
        <div className="absolute top-0 right-0 z-[100]">
          <button
            className="absolute -top-2 -right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1 shadow-md z-[100] transform translate-x-1/2 -translate-y-1/2"
            onClick={handleRemoveNode}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Node;
