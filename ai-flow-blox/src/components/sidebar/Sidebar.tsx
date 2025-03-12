import React, { useState } from 'react';
import { Workflow, PlusCircle, Share2, Settings, Save, Database, Network, Plug, Layers, Server, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import useWorkflowStore from '@/lib/store';
import { NodeType } from '@/lib/types';

const Sidebar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className="sidebar flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="bg-primary text-primary-foreground p-1 rounded">
            <Workflow className="h-4 w-4" />
          </span>
          FusionFlow
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Build your workflow step by step</p>
      </div>
      
      <div className="p-4 flex-1 overflow-auto space-y-4">
        <div className="flex flex-col gap-1.5">
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <PlusCircle className="h-4 w-4" />
            <span className="text-sm font-medium">New Workflow</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors">
            <Save className="h-4 w-4" />
            <span className="text-sm font-medium">Save Workflow</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors">
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">Share Workflow</span>
          </button>
        </div>

        {/* Data Integration Section */}
        <div className="border-t border-border pt-4">
          <button 
            onClick={() => toggleSection('integration')}
            className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">Data Integration</span>
            </div>
            <span className="text-xs">{activeSection === 'integration' ? '▼' : '▶'}</span>
          </button>
          
          {activeSection === 'integration' && (
            <div className="ml-4 mt-2 space-y-1.5">
              <Link 
                to="/cloud-data-integration" 
                className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-secondary transition-colors"
              >
                <Server className="h-4 w-4" />
                <span className="text-sm">Cloud Data Integration</span>
              </Link>
              
              <Link 
                to="/mass-ingestion" 
                className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-secondary transition-colors"
              >
                <Database className="h-4 w-4" />
                <span className="text-sm">Mass Ingestion</span>
              </Link>

              <Link 
                to="/data-quality" 
                className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-secondary transition-colors"
              >
                <GitBranch className="h-4 w-4" />
                <span className="text-sm">Data Quality</span>
              </Link>
            </div>
          )}
        </div>

        {/* Connectors Section */}
        <div className="border-t border-border pt-4">
          <button 
            onClick={() => toggleSection('connectors')}
            className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-2">
              <Plug className="h-4 w-4" />
              <span className="text-sm font-medium">Connectors</span>
            </div>
            <span className="text-xs">{activeSection === 'connectors' ? '▼' : '▶'}</span>
          </button>
          
          {activeSection === 'connectors' && (
            <div className="ml-4 mt-2 space-y-1.5">
              <Link 
                to="/marketplace" 
                className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-secondary transition-colors"
              >
                <Database className="h-4 w-4" />
                <span className="text-sm">Marketplace</span>
              </Link>
              
              <Link 
                to="/connections" 
                className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-secondary transition-colors"
              >
                <Network className="h-4 w-4" />
                <span className="text-sm">My Connections</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-secondary transition-colors">
          <Settings className="h-4 w-4" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
