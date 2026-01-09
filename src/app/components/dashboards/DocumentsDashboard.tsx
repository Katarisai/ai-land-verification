import {
  FileCheck2,
  FileWarning,
  Timer,
  ShieldCheck,
  Upload,
  FilePlus,
  Stamp,
} from 'lucide-react';
import { DashboardShell, Tone } from './DashboardShell';

interface DocumentsDashboardProps {
  onNavigate?: (page: string) => void;
}

export function DocumentsDashboard({ onNavigate }: DocumentsDashboardProps) {
  const kpis = [
    { label: 'Pending Reviews', value: 7, icon: <Timer className="w-5 h-5" />, badge: { label: 'Due soon', tone: 'warning' as Tone } },
    { label: 'Approved', value: 42, icon: <FileCheck2 className="w-5 h-5" />, badge: { label: 'Stable', tone: 'success' as Tone } },
    { label: 'Rejected', value: 3, icon: <FileWarning className="w-5 h-5" />, helper: 'Needs revision' },
    { label: 'Expiring', value: 5, icon: <ShieldCheck className="w-5 h-5" />, badge: { label: 'Renewal', tone: 'danger' as Tone } },
  ];

  const quickActions = [
    { label: 'Upload Document', icon: <Upload className="w-4 h-4" />, onClick: () => onNavigate?.('documents') },
    { label: 'Request Review', icon: <FilePlus className="w-4 h-4" />, onClick: () => onNavigate?.('documents') },
    { label: 'Apply Digital Stamp', icon: <Stamp className="w-4 h-4" />, onClick: () => onNavigate?.('documents') },
  ];

  const activities = [
    { title: 'Title deed - Coastal Lot', subtitle: 'Status: Review in progress', timestamp: '15 mins ago', status: 'info' as Tone },
    { title: 'Zoning certificate - Hilltop Ranch', subtitle: 'Approved', timestamp: '1 hour ago', status: 'success' as Tone },
    { title: 'Environmental report - Riverside Plot', subtitle: 'Revision requested', timestamp: 'Today', status: 'warning' as Tone },
  ];

  const notifications = [
    { title: '5 documents expiring this month', time: 'Just now', type: 'warning' as Tone },
    { title: 'Digital stamp applied to 3 files', time: '30 mins ago', type: 'success' as Tone },
    { title: 'Reminder: Upload updated zoning proofs', time: '2 hours ago', type: 'info' as Tone },
  ];

  return (
    <DashboardShell
      title="Documents Control Center"
      subtitle="Track document reviews, approvals, and expirations."
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Documents"
      onNavigate={onNavigate}
    />
  );
}
