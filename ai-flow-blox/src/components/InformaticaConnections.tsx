import React, { useEffect, useState } from 'react';
import { Database, Plus, RefreshCw, Settings } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import NewConnectionForm from './NewConnectionForm';

interface InformaticaConnection {
  id: string;
  name: string;
  type: string;
  description?: string;
  createdBy: string;
  createdTime: string;
  updateTime: string;
}

const InformaticaConnections = () => {
  const [connections, setConnections] = useState<InformaticaConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewConnectionOpen, setIsNewConnectionOpen] = useState(false);
  const { toast } = useToast();

  const fetchConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getInformaticaConnections();
      if (response.data?.connections) {
        setConnections(response.data.connections);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch connections';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Informatica Connections</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchConnections}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsNewConnectionOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Connection
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Dialog open={isNewConnectionOpen} onOpenChange={setIsNewConnectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Connection</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new Informatica connection.
            </DialogDescription>
          </DialogHeader>
          <NewConnectionForm
            onSuccess={() => {
              setIsNewConnectionOpen(false);
              fetchConnections();
            }}
            onCancel={() => setIsNewConnectionOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((connection) => (
          <Card key={connection.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{connection.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{connection.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {connection.description && (
                  <p className="text-muted-foreground">{connection.description}</p>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Created by: {connection.createdBy}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Created: {formatDate(connection.createdTime)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Updated: {formatDate(connection.updateTime)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!loading && connections.length === 0 && (
          <div className="col-span-full text-center py-8">
            <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No connections found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first connection.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsNewConnectionOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Connection
            </Button>
          </div>
        )}

        {loading && (
          <div className="col-span-full text-center py-8">
            <RefreshCw className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900">Loading connections...</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformaticaConnections; 