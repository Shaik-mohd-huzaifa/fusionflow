
import React from 'react';
import { ArrowLeft, Download, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Database,
  BarChart3,
  Building2,
  Cloud,
  Snowflake,
  CircuitBoard,
  FileText,
  Server,
  Network,
  Cpu,
  MessageSquare,
  FileBox
} from 'lucide-react';

// Map of connector icons using Lucide components
const connectorIcons = {
  'MySQL Database': <Database className="h-6 w-6 text-primary" />,
  'PostgreSQL Database': <Database className="h-6 w-6 text-primary" />,
  'Oracle Database': <Database className="h-6 w-6 text-primary" />,
  'Microsoft SQL Server': <Server className="h-6 w-6 text-primary" />,
  'Flat File': <FileText className="h-6 w-6 text-primary" />,
  'SFTP Server': <FileBox className="h-6 w-6 text-primary" />,
  'Salesforce': <BarChart3 className="h-6 w-6 text-primary" />,
  'Amazon S3': <Cloud className="h-6 w-6 text-primary" />,
  'Azure Blob Storage': <Cloud className="h-6 w-6 text-primary" />,
  'Google BigQuery': <Cpu className="h-6 w-6 text-primary" />,
  'REST API': <Network className="h-6 w-6 text-primary" />,
  'Apache Kafka': <MessageSquare className="h-6 w-6 text-primary" />,
  'MongoDB': <Database className="h-6 w-6 text-primary" />
};

const connectors = [
  {
    id: 1,
    name: 'MySQL Database',
    description: 'Connect to MySQL databases for data integration.',
    category: 'DATABASE'
  },
  {
    id: 2,
    name: 'PostgreSQL Database',
    description: 'Connect to PostgreSQL databases with schema support.',
    category: 'DATABASE'
  },
  {
    id: 3,
    name: 'Oracle Database',
    description: 'Connect to Oracle databases using service names.',
    category: 'DATABASE'
  },
  {
    id: 4,
    name: 'Microsoft SQL Server',
    description: 'Connect to Microsoft SQL Server with Windows or SQL authentication.',
    category: 'DATABASE'
  },
  {
    id: 5,
    name: 'MongoDB',
    description: 'Connect to MongoDB databases for NoSQL data integration.',
    category: 'DATABASE'
  },
  {
    id: 6,
    name: 'Flat File',
    description: 'Connect to flat files (CSV, Fixed-width, etc.).',
    category: 'FILE'
  },
  {
    id: 7,
    name: 'SFTP Server',
    description: 'Connect to SFTP servers with password or SSH key authentication.',
    category: 'FILE'
  },
  {
    id: 8,
    name: 'Salesforce',
    description: 'Connect to Salesforce CRM and automate your sales processes.',
    category: 'CLOUD'
  },
  {
    id: 9,
    name: 'Amazon S3',
    description: 'Connect to Amazon S3 storage buckets.',
    category: 'CLOUD'
  },
  {
    id: 10,
    name: 'Azure Blob Storage',
    description: 'Connect to Azure Blob Storage containers.',
    category: 'CLOUD'
  },
  {
    id: 11,
    name: 'Google BigQuery',
    description: 'Connect to Google BigQuery for analytics and reporting.',
    category: 'BIGDATA'
  },
  {
    id: 12,
    name: 'REST API',
    description: 'Connect to REST APIs with various authentication methods.',
    category: 'API'
  },
  {
    id: 13,
    name: 'Apache Kafka',
    description: 'Connect to Apache Kafka clusters for messaging integration.',
    category: 'MESSAGING'
  }
];

const Marketplace = () => {
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
          <Link to="/" className="hover:bg-secondary p-1.5 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold tracking-tight">Connector Marketplace</h1>
        </div>
      </motion.header>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Available Connectors</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search connectors..." 
                  className="pl-9 pr-4 py-2 bg-background border border-input rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectors.map((connector) => (
              <div key={connector.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 h-10 w-10 rounded-md flex items-center justify-center">
                      {connectorIcons[connector.name]}
                    </div>
                    <div>
                      <h3 className="font-medium">{connector.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{connector.category}</span>
                    </div>
                  </div>
                  <Link 
                    to="/connections" 
                    className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  {connector.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
