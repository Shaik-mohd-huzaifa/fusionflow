import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface NewConnectionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const connectionTypes = [
  { value: 'Oracle', label: 'Oracle Database' },
  { value: 'SQLServer', label: 'SQL Server' },
  { value: 'MySQL', label: 'MySQL' },
  { value: 'PostgreSQL', label: 'PostgreSQL' },
  { value: 'Snowflake', label: 'Snowflake' },
  { value: 'S3', label: 'Amazon S3' },
  { value: 'AzureBlobStorage', label: 'Azure Blob Storage' },
  { value: 'GoogleCloudStorage', label: 'Google Cloud Storage' },
  { value: 'Salesforce', label: 'Salesforce' },
  { value: 'ServiceNow', label: 'ServiceNow' },
  { value: 'REST', label: 'REST API' },
  { value: 'SOAP', label: 'SOAP Web Service' }
];

const NewConnectionForm: React.FC<NewConnectionFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createInformaticaConnection(formData);
      toast({
        title: 'Success',
        description: 'Connection created successfully',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create connection',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Connection Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="My New Connection"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Connection Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {connectionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter a description for your connection"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Connection'}
        </Button>
      </div>
    </form>
  );
};

export default NewConnectionForm; 