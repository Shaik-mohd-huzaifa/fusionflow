import React, { useState } from 'react';
import { ArrowLeft, Edit, Plus, Search, Trash2, Database, X, Eye, EyeOff, Play, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import InformaticaCredentials from '@/components/InformaticaCredentials';
import InformaticaConnections from '@/components/InformaticaConnections';

const myConnections = [
  {
    id: 1,
    name: 'Production Salesforce',
    type: 'Salesforce',
    status: 'Connected',
    lastUsed: '2 hours ago'
  },
  {
    id: 2,
    name: 'Development SAP',
    type: 'SAP',
    status: 'Connected',
    lastUsed: '3 days ago'
  },
  {
    id: 3,
    name: 'Analytics Snowflake',
    type: 'Snowflake',
    status: 'Error',
    lastUsed: '1 week ago'
  }
];

const connectionTypes = [
  { id: 'mysql', name: 'MySQL Database', icon: <Database className="h-5 w-5" />, category: 'DATABASE' },
  { id: 'postgresql', name: 'PostgreSQL Database', icon: <Database className="h-5 w-5" />, category: 'DATABASE' },
  { id: 'oracle', name: 'Oracle Database', icon: <Database className="h-5 w-5" />, category: 'DATABASE' },
  { id: 'mssql', name: 'Microsoft SQL Server', icon: <Database className="h-5 w-5" />, category: 'DATABASE' },
  { id: 'mongodb', name: 'MongoDB', icon: <Database className="h-5 w-5" />, category: 'DATABASE' },
  { id: 'flat_file', name: 'Flat File', icon: <Database className="h-5 w-5" />, category: 'FILE' },
  { id: 'sftp', name: 'SFTP Server', icon: <Database className="h-5 w-5" />, category: 'FILE' },
  { id: 'salesforce', name: 'Salesforce', icon: <Database className="h-5 w-5" />, category: 'CLOUD' },
  { id: 's3', name: 'Amazon S3', icon: <Database className="h-5 w-5" />, category: 'CLOUD' },
  { id: 'azure_blob', name: 'Azure Blob Storage', icon: <Database className="h-5 w-5" />, category: 'CLOUD' },
  { id: 'google_bigquery', name: 'Google BigQuery', icon: <Database className="h-5 w-5" />, category: 'BIGDATA' },
  { id: 'rest_api', name: 'REST API', icon: <Database className="h-5 w-5" />, category: 'API' },
  { id: 'kafka', name: 'Apache Kafka', icon: <Database className="h-5 w-5" />, category: 'MESSAGING' }
];

const MyConnections = () => {
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Connections</h1>
          <p className="text-gray-600 mt-2">
            Manage your data connections and credentials
          </p>
        </div>
        <Button onClick={() => setIsCredentialsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Credentials
        </Button>
      </div>

      <Dialog open={isCredentialsOpen} onOpenChange={setIsCredentialsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Informatica Credentials</DialogTitle>
            <DialogDescription>
              Enter your Informatica Cloud credentials to access your connections.
            </DialogDescription>
          </DialogHeader>
          <InformaticaCredentials onSuccess={() => {
            setIsCredentialsOpen(false);
            toast({
              title: "Success",
              description: "Credentials saved successfully",
            });
          }} />
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <InformaticaConnections />
      </div>
    </div>
  );
};

export default MyConnections;
