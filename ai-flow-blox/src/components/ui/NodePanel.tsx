
import React, { useState, useEffect } from 'react';
import useWorkflowStore from '@/lib/store';
import { INode } from '@/lib/types';
import { X, ChevronRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NodePanel: React.FC = () => {
  const { nodes, selectedNodeId, selectNode } = useWorkflowStore();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [nodeName, setNodeName] = useState('');
  
  // Update selected node when selection changes
  useEffect(() => {
    if (selectedNodeId) {
      const node = nodes.find(n => n.id === selectedNodeId);
      setSelectedNode(node || null);
      setNodeName(node?.title || '');
      setIsOpen(true);
    } else {
      setSelectedNode(null);
    }
  }, [selectedNodeId, nodes]);
  
  // Close panel handler
  const handleClose = () => {
    selectNode(null);
  };
  
  // Toggle panel visibility
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  if (!selectedNode) return null;
  
  return (
    <AnimatePresence>
      {selectedNode && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: isOpen ? 0 : 260, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 w-80 bg-background/90 backdrop-blur-lg border border-border rounded-lg shadow-lg overflow-hidden z-20"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePanel}
                className="p-1 rounded-full hover:bg-secondary"
              >
                <ChevronRight className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
              </button>
              <h3 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Node Settings
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Panel content */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Node Name</label>
                    <input
                      type="text"
                      value={nodeName}
                      onChange={e => setNodeName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Node Type</label>
                    <div className="px-3 py-2 rounded-md border border-input bg-muted/50">
                      {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                    </div>
                  </div>
                  
                  {/* Different configuration options based on node type */}
                  {selectedNode.type === 'ai' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Model Selection</label>
                      <select className="w-full px-3 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3">Claude 3</option>
                      </select>
                    </div>
                  )}
                  
                  {selectedNode.type === 'data' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Data Source</label>
                      <select className="w-full px-3 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="csv">CSV Upload</option>
                        <option value="api">API Endpoint</option>
                        <option value="database">Database</option>
                      </select>
                    </div>
                  )}
                  
                  {/* Node position information */}
                  <div className="mt-6 text-xs text-muted-foreground">
                    <div>Position X: {selectedNode.position.x.toFixed(0)}</div>
                    <div>Position Y: {selectedNode.position.y.toFixed(0)}</div>
                    <div>Node ID: {selectedNode.id.slice(0, 8)}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NodePanel;
