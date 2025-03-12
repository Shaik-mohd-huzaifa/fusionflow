import React, { useEffect, useState } from 'react';
import Canvas from '@/components/workspace/Canvas';
import Sidebar from '@/components/sidebar/Sidebar';
import NodePanel from '@/components/ui/NodePanel';
import useWorkflowStore from '@/lib/store';
import { motion } from 'framer-motion';
import { Workflow, Zap, Play, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InformaticaPrompt from '@/components/onboarding/InformaticaPrompt';
import ProfileButton from '@/components/ui/ProfileButton';

const Index = () => {
  const { toast } = useToast();
  const { nodes, connections, addNode } = useWorkflowStore();
  const [hasCredentials, setHasCredentials] = useState(false);
  
  // Only show welcome toast when we have credentials and add the first node
  useEffect(() => {
    if (hasCredentials && nodes.length === 0) {
      // Add a single trigger node to start with
      addNode('input', { x: window.innerWidth / 2 - 128, y: 100 }, 'Trigger');
      
      // Show welcome toast
      toast({
        title: "Welcome to FusionFlow",
        description: "Add nodes to your workflow by clicking the + button below each node.",
        duration: 5000,
      });
    }
  }, [hasCredentials]);
  
  // // If no credentials, show the connection prompt
  // if (!hasCredentials) {
  //   return (
  //     <div className="h-screen w-screen overflow-hidden flex flex-col">
  //       {/* Header */}
  //       <motion.header
  //         initial={{ y: -50, opacity: 0 }}
  //         animate={{ y: 0, opacity: 1 }}
  //         transition={{ delay: 0.2, duration: 0.5 }}
  //         className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/70 backdrop-blur-lg z-10"
  //       >
  //         <div className="flex items-center gap-2">
  //           <div className="bg-primary text-primary-foreground p-1.5 rounded">
  //             <Workflow className="h-5 w-5" />
  //           </div>
  //           <h1 className="font-semibold tracking-tight">FusionFlow</h1>
  //         </div>
  //       </motion.header>
        
  //       {/* Connection prompt */}
  //       <div className="flex-1 flex items-center justify-center p-4">
  //         <InformaticaPrompt onSuccess={() => setHasCredentials(true)} />
  //       </div>
  //     </div>
  //   );
  // }
  
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/70 backdrop-blur-lg z-10"
      >
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded">
            <Workflow className="h-5 w-5" />
          </div>
          <h1 className="font-semibold tracking-tight">FusionFlow</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" />
            <span>{nodes.length} Nodes</span>
            <span className="mx-1">•</span>
            <span>{connections.length} Connections</span>
          </div>
          
          <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5">
            <Play className="h-3.5 w-3.5" />
            <span>Run Workflow</span>
          </button>
          
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
          
          <ProfileButton />
        </div>
      </motion.header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <motion.div
          initial={{ x: -240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-64 border-r border-border"
        >
          <Sidebar />
        </motion.div>
        
        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Canvas />
        </motion.div>
      </div>
      
      {/* Node configuration panel */}
      <NodePanel />
    </div>
  );
};

export default Index;
