
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ProfileButton = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('informaticaLogin');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem('informaticaLogin');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    // Force page reload to show login screen
    window.location.reload();
  };

  if (!userData) return null;

  const username = userData.username || 'User';
  const initial = username.charAt(0).toUpperCase();

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 p-0"
                aria-label="User profile"
              >
                {initial}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{username}</p>
          </TooltipContent>
        </Tooltip>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span>{username}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {userData.podUrl}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default ProfileButton;
