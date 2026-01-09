import { User } from '../App';
import { SellerDashboard } from './dashboards/SellerDashboard';
import { BuyerDashboard } from './dashboards/BuyerDashboard';
import { VerifierDashboard } from './dashboards/VerifierDashboard';
import { FinancialDashboard } from './dashboards/FinancialDashboard';
import { DocumentsDashboard } from './dashboards/DocumentsDashboard';
import { SystemHealthDashboard } from './dashboards/SystemHealthDashboard';
import { LegalDashboard } from './dashboards/LegalDashboard';
import { AdminUnifiedDashboard } from './dashboards/AdminUnifiedDashboard';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: any) => void;
  onToggleAI: () => void;
}

// Unified dashboard router: renders the appropriate experience per role.
export function Dashboard({ user, onNavigate }: DashboardProps) {
  if (user.role === 'seller') return <SellerDashboard onNavigate={onNavigate} />;
  if (user.role === 'buyer') return <BuyerDashboard onNavigate={onNavigate} />;
  if (user.role === 'legal') return <VerifierDashboard onNavigate={onNavigate} />;
  if (user.role === 'admin') return <AdminUnifiedDashboard onNavigate={onNavigate} />;

  // Fallbacks / additional surfaces
  if (user.role === null) return <SellerDashboard onNavigate={onNavigate} />;
  return <DocumentsDashboard onNavigate={onNavigate} />;
}
