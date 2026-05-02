import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { LandListings } from './components/LandListings';
import { LandDetail } from './components/LandDetail';
import { ContactAgent } from './components/ContactAgent';
import { AIAssistant } from './components/AIAssistantClean';
import { NavigationMenu } from './components/NavigationMenu';
import { ViewDocuments } from './components/ViewDocuments';
import { ProjectsPage } from './components/ProjectsPage';
import { RawMaterialsPage } from './components/RawMaterialsPage';
import { WorkersPage } from './components/WorkersPage';
import { SchedulePage } from './components/SchedulePage';
import { DailyReportsPage } from './components/DailyReportsPage';
import { SettingsPage } from './components/SettingsPage';
import { SellerProfile } from './components/SellerProfile';
import { SellerAnalytics } from './components/SellerAnalytics';
import { InquiryManagement } from './components/InquiryManagement';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Bot, MoreVertical } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

export type UserRole = 'buyer' | 'seller' | 'legal' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

function AppContent() {
  const { user, login, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'dashboard' | 'listings' | 'detail' | 'contact-agent' | 'projects' | 'materials' | 'suppliers' | 'workers' | 'schedule' | 'daily-reports' | 'work-reports' | 'reports' | 'settings' | 'documents' | 'seller-profile' | 'seller-analytics' | 'inquiry-management'>('landing');
  const [selectedLandId, setSelectedLandId] = useState<string | null>(null);
  const [selectedLandTitle, setSelectedLandTitle] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [initialAIPrompt, setInitialAIPrompt] = useState<string | null>(null);
  const [quickPrompt, setQuickPrompt] = useState('');
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [pendingLoginRole, setPendingLoginRole] = useState<Exclude<UserRole, null>>('buyer');

  // Restore current page and selected land from sessionStorage on mount
  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete
    
    if (user) {
      const savedPage = sessionStorage.getItem('currentPage');
      const savedLandId = sessionStorage.getItem('selectedLandId');
      const savedLandTitle = sessionStorage.getItem('selectedLandTitle');
      
      if (savedPage) {
        setCurrentPage(savedPage as any);
        if (savedLandId && (savedPage === 'detail' || savedPage === 'contact-agent' || savedPage === 'listings')) {
          setSelectedLandId(savedLandId);
        }
        if (savedLandTitle && savedPage === 'contact-agent') {
          setSelectedLandTitle(savedLandTitle);
        }
      } else {
        setCurrentPage('dashboard');
      }
    } else {
      setCurrentPage('landing');
    }
  }, [user, isLoading]);

  // Save current page and selected land to sessionStorage whenever they change
  useEffect(() => {
    if (currentPage !== 'login' && currentPage !== 'landing' && user) {
      sessionStorage.setItem('currentPage', currentPage);
      if (selectedLandId) {
        sessionStorage.setItem('selectedLandId', selectedLandId);
      } else {
        sessionStorage.removeItem('selectedLandId');
      }
      if (selectedLandTitle) {
        sessionStorage.setItem('selectedLandTitle', selectedLandTitle);
      } else {
        sessionStorage.removeItem('selectedLandTitle');
      }
    } else if (currentPage === 'login' || currentPage === 'landing') {
      // Clear session storage on logout
      sessionStorage.removeItem('currentPage');
      sessionStorage.removeItem('selectedLandId');
      sessionStorage.removeItem('selectedLandTitle');
    }
  }, [currentPage, selectedLandId, selectedLandTitle, user]);

  const openLoginPage = (role?: UserRole) => {
    setPendingLoginRole(role ?? 'buyer');
    setCurrentPage('login');
  };

  const handleLogin = (role: UserRole) => {
    // Mock login
    const mockUser = {
      id: '1',
      name: role === 'buyer' ? 'John Buyer' : role === 'seller' ? 'Sarah Seller' : role === 'legal' ? 'Legal Expert' : 'Admin User',
      email: `${role}@cm.com`,
      role
    };
    const mockToken = 'token-' + Date.now();
    login(mockUser, mockToken);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('landing');
    setSelectedLandId(null);
    setShowNavigationMenu(false);
    sessionStorage.removeItem('currentPage');
    sessionStorage.removeItem('selectedLandId');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleViewLand = (landId: string) => {
    setSelectedLandId(landId);
    setCurrentPage('detail');
  };

  const handleContactAgent = (landId: string, landTitle: string) => {
    setSelectedLandId(landId);
    setSelectedLandTitle(landTitle);
    setCurrentPage('contact-agent');
  };

  const handleBack = () => {
    if (currentPage === 'detail' || currentPage === 'contact-agent') {
      setCurrentPage('listings');
      setSelectedLandId(null);
      setSelectedLandTitle(null);
    } else if (currentPage === 'listings') {
      setCurrentPage('dashboard');
    }
  };

  const openAssistant = (prompt?: string) => {
    setInitialAIPrompt(prompt ?? null);
    setShowAIAssistant(true);
  };

  const handleSubmitQuickPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickPrompt.trim()) return openAssistant();
    openAssistant(quickPrompt.trim());
    setQuickPrompt('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && currentPage !== 'login' && (
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                <Bot className="w-4 h-4" />
              </span>
              AI Copilot
              <span className="text-xs font-normal text-gray-500">Ask anything about land verification, docs, or construction.</span>
            </div>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmitQuickPrompt}>
              <div className="flex-1 flex gap-2">
                <Input
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Ask a quick question..."
                  className="bg-white"
                />
                <Button type="submit" variant="default">Ask</Button>
                <Button type="button" variant="outline" onClick={() => openAssistant()}>Open Chat</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Check document status', 'Explain verification steps', 'Construction feasibility', 'Show risks'].map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => openAssistant(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}

      {currentPage === 'landing' && !user && (
        <LandingPage
          onSignIn={() => openLoginPage()}
          onBrowseVerifiedLands={() => openLoginPage('buyer')}
          onListYourProperty={() => openLoginPage('seller')}
          onExplorePlatform={() => openLoginPage('buyer')}
          onLearnMore={() => {}}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          initialRole={pendingLoginRole}
          onBackToLanding={() => setCurrentPage('landing')}
        />
      )}

      {currentPage === 'dashboard' && user && (
        <div className="relative">
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onNavigate={setCurrentPage}
            onToggleAI={() => openAssistant()}
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
          onToggleAI={() => openAssistant()}
          onContactAgent={handleContactAgent}
        />
      )}

      {currentPage === 'detail' && user && selectedLandId && (
        <LandDetail
          user={user}
          landId={selectedLandId}
          onLogout={handleLogout}
          onBack={handleBack}
          onToggleAI={() => openAssistant()}
        />
      )}

      {currentPage === 'contact-agent' && user && selectedLandId && (
        <ContactAgent
          user={user}
          landId={selectedLandId}
          landTitle={selectedLandTitle || ''}
          onLogout={handleLogout}
          onBack={handleBack}
          onToggleAI={() => openAssistant()}
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

      {currentPage === 'listings' && user && (
        <LandListings
          user={user}
          onLogout={handleLogout}
          onViewLand={handleViewLand}
          onBack={handleBack}
          onToggleAI={() => openAssistant()}
          onContactAgent={handleContactAgent}
        />
      )}

      {/* Construction Management Pages */}
      {currentPage === 'projects' && user && (
        <ProjectsPage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => openAssistant()}
        />
      )}

      {currentPage === 'materials' && user && (
        <RawMaterialsPage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => openAssistant()}
        />
      )}

      {currentPage === 'workers' && user && (
        <WorkersPage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => openAssistant()}
        />
      )}

      {currentPage === 'schedule' && user && (
        <SchedulePage
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => openAssistant()}
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

      {/* PHASE 1 CRITICAL - SELLER FEATURES */}
      {currentPage === 'seller-profile' && user && user.role === 'seller' && (
        <SellerProfile
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => openAssistant()}
        />
      )}

      {currentPage === 'seller-analytics' && user && user.role === 'seller' && (
        <SellerAnalytics
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => openAssistant()}
        />
      )}

      {currentPage === 'inquiry-management' && user && (
        <InquiryManagement
          user={user}
          onLogout={handleLogout}
          onBack={() => setCurrentPage('dashboard')}
          onToggleAI={() => openAssistant()}
        />
      )}

      {currentPage === 'reports' && user && (
        <div className="min-h-screen bg-gray-50">
          <nav className="border-b bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setCurrentPage('dashboard')} className="gap-2">
                  ← Back to Dashboard
                </Button>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-right">
                    <div className="font-semibold">{user.name}</div>
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">AI Reports</h1>
              <p className="text-gray-600">View and manage AI-generated analysis reports for your properties</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: '5.2 Acres Riverside Plot', date: '1 hour ago', status: 'Completed', risk: 'Low', score: '92%' },
                { title: '2.8 Acres Residential Plot', date: '3 hours ago', status: 'Processing', risk: 'Medium', score: '85%' },
                { title: '10 Acres Commercial Land', date: '1 day ago', status: 'Completed', risk: 'Low', score: '88%' },
              ].map((report, idx) => (
                <div key={idx} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900 flex-1">{report.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      report.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div>Generated: {report.date}</div>
                    <div>Risk Level: <span className={report.risk === 'Low' ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>{report.risk}</span></div>
                    <div>Verification Score: <span className="font-semibold text-blue-600">{report.score}</span></div>
                  </div>
                  <button className="w-full mt-4 bg-orange-500 text-white rounded-md py-2 hover:bg-orange-600 transition text-sm font-medium">
                    View Full Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Placeholder pages for remaining features */}
      {(currentPage === 'suppliers' || currentPage === 'work-reports') && user && (
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
          initialQuestion={initialAIPrompt ?? undefined}
          onClose={() => {
            setShowAIAssistant(false);
            setInitialAIPrompt(null);
          }}
        />
      )}

      {showNavigationMenu && user && (
        <NavigationMenu
          onNavigate={(page) => setCurrentPage(page as any)}
          onClose={() => setShowNavigationMenu(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
