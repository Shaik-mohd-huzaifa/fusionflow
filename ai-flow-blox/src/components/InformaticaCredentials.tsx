import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface InformaticaCredentialsProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

const InformaticaCredentials: React.FC<InformaticaCredentialsProps> = ({ isOpen = true, onClose = () => {}, onSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    security_domain: '',
    pod_url: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchCredentials();
    }
  }, [isOpen]);

  const fetchCredentials = async () => {
    try {
      const response = await api.getInformaticaCredentials();
      setCredentials({
        username: response.data.username,
        password: '',  // Password is not returned from API
        security_domain: response.data.security_domain || '',
        pod_url: response.data.pod_url
      });
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch existing credentials",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.saveInformaticaCredentials(credentials);
      toast({
        title: "Success",
        description: "Informatica credentials have been saved.",
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Informatica Credentials</DialogTitle>
          <DialogDescription>
            Enter your Informatica credentials to use with the platform.
            These credentials will be securely stored and used for all Informatica operations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pod_url">Pod URL</Label>
            <Input
              id="pod_url"
              value={credentials.pod_url}
              onChange={(e) => setCredentials(prev => ({ ...prev, pod_url: e.target.value }))}
              placeholder="https://dm-us.informaticacloud.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="security_domain">Security Domain (Optional)</Label>
            <Input
              id="security_domain"
              value={credentials.security_domain}
              onChange={(e) => setCredentials(prev => ({ ...prev, security_domain: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Credentials'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InformaticaCredentials; 