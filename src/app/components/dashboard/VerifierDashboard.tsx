export { VerifierDashboard } from '../dashboards/VerifierDashboard';
/*
import {
  ClipboardList,
  CheckCircle2,
  AlarmClock,
  AlertTriangle,
  Play,
  ClipboardCheck,
  FileSignature,
} from 'lucide-react';
import { DashboardShell, Tone } from './DashboardShell';

export function VerifierDashboard() {
  const kpis = [
    { label: 'Open Cases', value: 22, icon: <ClipboardList className="w-5 h-5" />, badge: { label: 'Queued', tone: 'warning' as Tone } },
    { label: 'Completed Today', value: 9, icon: <CheckCircle2 className="w-5 h-5" />, badge: { label: '+3 vs avg', tone: 'success' as Tone } },
    { label: 'Avg SLA (hrs)', value: '5.8', icon: <AlarmClock className="w-5 h-5" />, helper: 'Target: 6h' },
    { label: 'Escalations', value: 2, icon: <AlertTriangle className="w-5 h-5" />, badge: { label: 'Attention', tone: 'danger' as Tone } },
  ];

  const quickActions = [
    { label: 'Pick Next Case', icon: <Play className="w-4 h-4" /> },
    { label: 'Submit Report', icon: <ClipboardCheck className="w-4 h-4" /> },
    { label: 'Sign & Close', icon: <FileSignature className="w-4 h-4" /> },
  ];

  const activities = [
    { title: 'Case #4823 - Coastal Villa', subtitle: 'Status: Review documents', timestamp: '12 mins ago', status: 'info' },
    { title: 'Case #4818 - Industrial Lot', subtitle: 'Report submitted', timestamp: '1 hour ago', status: 'success' },
    { title: 'Case #4802 - Downtown Plot', subtitle: 'Awaiting owner response', timestamp: '4 hours ago', status: 'warning' },
  ];

  const notifications = [
    { title: 'Escalation: Downtown Plot missing zoning proof', time: '10 mins ago', type: 'danger' },
    { title: 'Reminder: SLA target 6h for new cases', time: '1 hour ago', type: 'info' },
    { title: 'Signed report synced to archive', time: 'Today', type: 'success' },
  ];

  return (
    <DashboardShell
      title="Verifier Command Center"
      subtitle="Manage your case queue, SLA, and escalations."
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Dashboard"
    />
  );
}
*/
