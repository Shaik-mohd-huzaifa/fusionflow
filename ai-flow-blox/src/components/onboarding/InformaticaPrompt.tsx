import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Cloud, Key, User, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

interface InformaticaPromptProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

const InformaticaPrompt: React.FC<InformaticaPromptProps> = ({ isOpen, onClose, onComplete }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    security_domain: '',
    pod_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen !== undefined) {
      setShowDialog(isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    if (showDialog) {
      fetchCredentials();
    }
  }, [showDialog]);

  const fetchCredentials = async () => {
    try {
      const response = await api.getInformaticaCredentials();
      setCredentials(prev => ({
        ...prev,
        username: response.data.username,
        security_domain: response.data.security_domain || '',
        pod_url: response.data.pod_url || '',
        password: '' // Password is not returned from API
      }));
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password || !credentials.pod_url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await api.saveInformaticaCredentials(credentials);
      
      toast({
        title: "Success",
        description: "Successfully connected to Informatica Cloud Services",
      });
      
      handleClose();
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect to Informatica Cloud Services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    if (onClose) {
      onClose();
    }
  };

  // If isOpen is undefined, we're in onboarding mode
  if (isOpen === undefined) {
    return (
      <>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center p-8 bg-card rounded-lg border border-border shadow-lg max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Cloud className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Connect to Informatica Cloud</h2>
          <p className="text-muted-foreground text-center mb-6">
            Connect your Informatica Cloud Services account to start building workflows
          </p>
          
          <Button 
            size="lg" 
            className="w-full"
            onClick={() => setShowDialog(true)}
          >
            <Cloud className="mr-2 h-4 w-4" />
            Connect Informatica Account
          </Button>
        </motion.div>

        <CredentialsDialog 
          showDialog={showDialog}
          credentials={credentials}
          setCredentials={setCredentials}
          isLoading={isLoading}
          onClose={handleClose}
          onSubmit={handleConnect}
        />
      </>
    );
  }

  // If isOpen is defined, we're in settings mode
  return (
    <CredentialsDialog 
      showDialog={showDialog}
      credentials={credentials}
      setCredentials={setCredentials}
      isLoading={isLoading}
      onClose={handleClose}
      onSubmit={handleConnect}
    />
  );
};

interface CredentialsDialogProps {
  showDialog: boolean;
  credentials: {
    username: string;
    password: string;
    security_domain: string;
    pod_url: string;
  };
  setCredentials: React.Dispatch<React.SetStateAction<{
    username: string;
    password: string;
    security_domain: string;
    pod_url: string;
  }>>;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const CredentialsDialog: React.FC<CredentialsDialogProps> = ({
  showDialog,
  credentials,
  setCredentials,
  isLoading,
  onClose,
  onSubmit
}) => (
  <Dialog open={showDialog} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Connect to Informatica Cloud Services</DialogTitle>
        <DialogDescription>
          Enter your Informatica Cloud Services credentials to connect your account
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={onSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Username
          </label>
          <Input
            id="username"
            type="text"
            placeholder="your.username@example.com"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="podUrl" className="text-sm font-medium flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Pod URL
          </label>
          <Input
            id="podUrl"
            type="text"
            placeholder="https://na1.informaticacloud.com"
            value={credentials.pod_url}
            onChange={(e) => setCredentials(prev => ({ ...prev, pod_url: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="securityDomain" className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            Security Domain (Optional)
          </label>
          <Input
            id="securityDomain"
            type="text"
            placeholder="Enter security domain"
            value={credentials.security_domain}
            onChange={(e) => setCredentials(prev => ({ ...prev, security_domain: e.target.value }))}
          />
        </div>
        
        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                Connecting...
              </>
            ) : (
              <>Connect</>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

export default InformaticaPrompt;
