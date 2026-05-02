import React from 'react';
import { LogOut, Menu, X, Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
  menuOpen?: boolean;
}

export function AppHeader({
  title = 'AI Land Verification',
  subtitle = 'Platform',
  showMenu = true,
  onMenuClick = () => {},
  menuOpen = false
}: AppHeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (!user) {
    return null; // Don't show header if not logged in
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section: Menu & Title */}
        <div className="flex items-center gap-4">
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle Menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          )}

          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>

        {/* Right Section: User Info & Actions */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Details */}
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>

            {/* Logout Button - MAIN LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="ml-4 flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium text-sm"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Status Bar */}
      <div className="bg-blue-50 border-t border-blue-100 px-6 py-2 text-xs text-blue-800">
        <span>Logged in as:</span>
        <span className="font-semibold ml-2">{user.email}</span>
        <span className="ml-4 px-2 py-1 bg-blue-200 rounded capitalize text-blue-900">
          {user.role}
        </span>
      </div>
    </header>
  );
}

export default AppHeader;
