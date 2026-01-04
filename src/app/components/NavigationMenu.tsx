import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, Home, FolderOpen, Package, Users, Calendar, FileText, BarChart3, Settings } from 'lucide-react';

interface NavigationMenuProps {
  onNavigate: (page: string) => void;
  onClose: () => void;
}

export function NavigationMenu({ onNavigate, onClose }: NavigationMenuProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'daily-reports', label: 'Daily Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (pageId: string) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardContent className="p-0 max-h-[calc(80vh-80px)] overflow-y-auto">
          <div className="space-y-1 p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start h-12 px-3"
                  onClick={() => handleNavigate(item.id)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
