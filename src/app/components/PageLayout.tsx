import React, { ReactNode } from 'react';
import AppHeader from './AppHeader';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
  menuOpen?: boolean;
  className?: string;
}

/**
 * PageLayout Component
 * 
 * Wraps all authenticated pages with:
 * - Header with logout button
 * - Consistent styling
 * - User information display
 * 
 * Usage:
 * <PageLayout title="Dashboard" subtitle="Overview">
 *   <YourPageContent />
 * </PageLayout>
 */
export function PageLayout({
  children,
  title = 'AI Land Verification',
  subtitle = 'Platform',
  showMenu = true,
  onMenuClick = () => {},
  menuOpen = false,
  className = ''
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logout Button - VISIBLE ON ALL PAGES */}
      <AppHeader
        title={title}
        subtitle={subtitle}
        showMenu={showMenu}
        onMenuClick={onMenuClick}
        menuOpen={menuOpen}
      />

      {/* Main Content Area */}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600 text-sm">
            © 2024 AI Land Verification Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PageLayout;
