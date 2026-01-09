import {
  Scale,
  FileSignature,
  Landmark,
  Stamp,
  FileText,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import { DashboardShell, Tone } from './DashboardShell';

interface LegalDashboardProps {
  onNavigate?: (page: string) => void;
}

export function LegalDashboard({ onNavigate }: LegalDashboardProps) {
  const kpis = [
    { label: 'Contracts In Review', value: 11, icon: <FileSignature className="w-5 h-5" />, badge: { label: 'Due', tone: 'warning' as Tone } },
    { label: 'Approvals Today', value: 6, icon: <Stamp className="w-5 h-5" />, badge: { label: '+2 vs avg', tone: 'success' as Tone } },
    { label: 'Compliance Checks', value: 18, icon: <Scale className="w-5 h-5" />, helper: '5 pending clarifications' },
    { label: 'Disputes', value: 3, icon: <Landmark className="w-5 h-5" />, badge: { label: 'Mediation', tone: 'danger' as Tone } },
  ];

  const quickActions = [
    { label: 'Draft Contract', icon: <FileText className="w-4 h-4" />, onClick: () => onNavigate?.('documents') },
    { label: 'Generate Summary', icon: <ScrollText className="w-4 h-4" />, onClick: () => onNavigate?.('documents') },
    { label: 'Run Compliance Check', icon: <ShieldCheck className="w-4 h-4" />, onClick: () => onNavigate?.('documents') },
  ];

  const activities = [
    { title: 'SPA for Coastal Lot', subtitle: 'Redlines received', timestamp: '30 mins ago', status: 'info' as Tone },
    { title: 'NDA package approved', subtitle: 'Riverside Plot', timestamp: '1 hour ago', status: 'success' as Tone },
    { title: 'Dispute hearing set', subtitle: 'Industrial Park buyer', timestamp: 'Today', status: 'warning' as Tone },
  ];

  const notifications = [
    { title: 'Compliance rule update: KYC refresh required', time: 'Just now', type: 'warning' as Tone },
    { title: 'Signature completed for SPA #2341', time: '45 mins ago', type: 'success' as Tone },
    { title: 'Hearing reminder: Buyer dispute', time: 'Tomorrow', type: 'info' as Tone },
  ];

  return (
    <DashboardShell
      title="Legal Workspace"
      subtitle="Contracts, compliance checks, and dispute tracking."
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Documents"
      onNavigate={onNavigate}
    />
  );
}
