import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { LandListings } from './components/LandListings';
import { LandDetail } from './components/LandDetail';
import { AIAssistant } from './components/AIAssistant';
import { NavigationMenu } from './components/NavigationMenu';
import { ViewDocuments } from './components/ViewDocuments';
import { ProjectsPage } from './components/ProjectsPage';
import { RawMaterialsPage } from './components/RawMaterialsPage';
import { WorkersPage } from './components/WorkersPage';
import { SchedulePage } from './components/SchedulePage';
import { DailyReportsPage } from './components/DailyReportsPage';
import { SettingsPage } from './components/SettingsPage';
import { Button } from './components/ui/button';
import { MoreVertical } from 'lucide-react';

export type UserRole = 'buyer' | 'seller' | 'legal' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'listings' | 'detail' | 'projects' | 'materials' | 'suppliers' | 'workers' | 'schedule' | 'daily-reports' | 'work-reports' | 'reports' | 'settings' | 'documents'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedLandId, setSelectedLandId] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);

  const handleLogin = (role: UserRole) => {
    // Mock login
    setUser({
      id: '1',
      name: role === 'buyer' ? 'John Buyer' : role === 'seller' ? 'Sarah Seller' : 'Legal Expert',
      email: `${role}@cm.com`,
      role
    });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setSelectedLandId(null);
    setShowNavigationMenu(false);
  };

  const handleViewLand = (landId: string) => {
    setSelectedLandId(landId);
    setCurrentPage('detail');
  };

  const handleBack = () => {
    if (currentPage === 'detail') {
      setCurrentPage('listings');
      setSelectedLandId(null);
    } else if (currentPage === 'listings') {
      setCurrentPage('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {currentPage === 'dashboard' && user && (
        <div className="relative">
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onNavigate={setCurrentPage}
            onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
          />
          <Button
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-40"
            onClick={() => setShowNavigationMenu(true)}
          >
            <MoreVertical className="w-6 h-6" />
          </Button>
        </div>
      )}

      {currentPage === 'listings' && user && (
        <LandListings
          user={user}
          onLogout={handleLogout}
          onViewLand={handleViewLand}
          onBack={handleBack}
          onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {currentPage === 'detail' && user && selectedLandId && (
        <LandDetail
          user={user}
          landId={selectedLandId}
          onLogout={handleLogout}
          onBack={handleBack}
          onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {/* View Documents Page */}
      {currentPage === 'documents' && user && (
        <ViewDocuments
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}

      {/* Construction Management Pages */}
      {currentPage === 'projects' && user && (
        <ProjectsPage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {currentPage === 'materials' && user && (
        <RawMaterialsPage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {currentPage === 'workers' && user && (
        <WorkersPage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {currentPage === 'schedule' && user && (
        <SchedulePage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {currentPage === 'daily-reports' && user && (
        <DailyReportsPage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {currentPage === 'settings' && user && (
        <SettingsPage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {/* Placeholder pages for remaining features */}
      {(currentPage === 'suppliers' || currentPage === 'work-reports' || currentPage === 'reports') && user && (
        <div className="min-h-screen bg-gray-50">
          <nav className="border-b bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">Construction Manager</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <div>{user.name}</div>
                    <div className="text-gray-500 text-xs capitalize">{user.role}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl mb-4 capitalize">{currentPage.replace('-', ' ')}</h1>
              <p className="text-gray-600 mb-8">
                This page is under development. Coming soon!
              </p>
              <Button onClick={() => setCurrentPage('dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>

          <Button
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-40"
            onClick={() => setShowNavigationMenu(true)}
          >
            <MoreVertical className="w-6 h-6" />
          </Button>
        </div>
      )}

      {showAIAssistant && user && (
        <AIAssistant
          user={user}
          onClose={() => setShowAIAssistant(false)}
        />
      )}

      {showNavigationMenu && user && (
        <NavigationMenu
          onNavigate={setCurrentPage}
          onClose={() => setShowNavigationMenu(false)}
        />
      )}
    </div>
  );
}
