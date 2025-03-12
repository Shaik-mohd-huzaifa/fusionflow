
import React, { useState } from 'react';
import { Plus, X, MessageSquare, Database, FileInput, FileOutput, Brain, 
  Plug, Link, FileText, Cog, Server, FileBadge, Cloud, FileBox,
  ArrowUpDown, Table, Box } from 'lucide-react';
import { NodeType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/hooks/use-click-away';

interface AddNodeButtonProps {
  onSelectNodeType: (type: NodeType) => void;
}

const AddNodeButton: React.FC<AddNodeButtonProps> = ({ onSelectNodeType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => setIsOpen(false));

  const nodeOptions = [
    {
      category: "LLMs",
      items: [
        { type: 'ai', label: 'GPT Model', icon: <MessageSquare className="h-4 w-4" />, color: 'bg-purple-500' },
        { type: 'ai', label: 'Claude Model', icon: <Brain className="h-4 w-4" />, color: 'bg-purple-500' }
      ]
    },
    {
      category: "Databases",
      items: [
        { type: 'data', label: 'MySQL', icon: <Database className="h-4 w-4" />, color: 'bg-blue-500' },
        { type: 'data', label: 'PostgreSQL', icon: <Database className="h-4 w-4" />, color: 'bg-blue-500' },
        { type: 'data', label: 'Oracle', icon: <Database className="h-4 w-4" />, color: 'bg-blue-500' },
        { type: 'data', label: 'SQL Server', icon: <Server className="h-4 w-4" />, color: 'bg-blue-500' },
        { type: 'data', label: 'MongoDB', icon: <Database className="h-4 w-4" />, color: 'bg-blue-500' }
      ]
    },
    {
      category: "File Systems",
      items: [
        { type: 'data', label: 'Flat File', icon: <FileBadge className="h-4 w-4" />, color: 'bg-amber-500' },
        { type: 'data', label: 'SFTP Server', icon: <FileBox className="h-4 w-4" />, color: 'bg-amber-500' }
      ]
    },
    {
      category: "Cloud Services",
      items: [
        { type: 'data', label: 'Salesforce', icon: <Cloud className="h-4 w-4" />, color: 'bg-sky-500' },
        { type: 'data', label: 'Amazon S3', icon: <Cloud className="h-4 w-4" />, color: 'bg-sky-500' },
        { type: 'data', label: 'Azure Blob', icon: <Cloud className="h-4 w-4" />, color: 'bg-sky-500' },
        { type: 'data', label: 'Google BigQuery', icon: <Table className="h-4 w-4" />, color: 'bg-sky-500' }
      ]
    },
    {
      category: "APIs & Messaging",
      items: [
        { type: 'data', label: 'REST API', icon: <Link className="h-4 w-4" />, color: 'bg-indigo-500' },
        { type: 'data', label: 'Apache Kafka', icon: <ArrowUpDown className="h-4 w-4" />, color: 'bg-indigo-500' }
      ]
    },
    {
      category: "Input/Output",
      items: [
        { type: 'input', label: 'Input', icon: <FileInput className="h-4 w-4" />, color: 'bg-orange-500' },
        { type: 'output', label: 'Output', icon: <FileOutput className="h-4 w-4" />, color: 'bg-green-500' },
        { type: 'output', label: 'Text Output', icon: <FileText className="h-4 w-4" />, color: 'bg-green-500' }
      ]
    },
    {
      category: "Other",
      items: [
        { type: 'data', label: 'Function', icon: <Cog className="h-4 w-4" />, color: 'bg-slate-500' },
        { type: 'data', label: 'Custom Connector', icon: <Box className="h-4 w-4" />, color: 'bg-slate-500' }
      ]
    }
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Plus size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg shadow-lg p-3 w-64 z-10 max-h-96 overflow-y-auto"
          >
            <div className="flex flex-col space-y-3">
              {nodeOptions.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-1">
                  <div className="text-xs uppercase font-semibold text-muted-foreground px-1.5">
                    {category.category}
                  </div>
                  <div className="space-y-0.5">
                    {category.items.map((item, itemIndex) => (
                      <button
                        key={`${categoryIndex}-${itemIndex}`}
                        className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-secondary transition-colors"
                        onClick={() => {
                          onSelectNodeType(item.type as NodeType);
                          setIsOpen(false);
                        }}
                      >
                        <div className={`${item.color} text-white w-6 h-6 rounded-full flex items-center justify-center`}>
                          {item.icon}
                        </div>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddNodeButton;
