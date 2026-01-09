import {
  Activity,
  ServerCog,
  ShieldAlert,
  RefreshCw,
  Bug,
  Cpu,
} from 'lucide-react';
import { DashboardShell, Tone } from './DashboardShell';

interface SystemHealthDashboardProps {
  onNavigate?: (page: string) => void;
}

export function SystemHealthDashboard({ onNavigate }: SystemHealthDashboardProps) {
  const kpis = [
    { label: 'Uptime (7d)', value: '99.92%', icon: <Activity className="w-5 h-5" />, badge: { label: 'Stable', tone: 'success' as Tone } },
    { label: 'Incidents', value: 2, icon: <ShieldAlert className="w-5 h-5" />, badge: { label: 'In review', tone: 'warning' as Tone } },
    { label: 'Queued Jobs', value: 148, icon: <ServerCog className="w-5 h-5" />, helper: 'ETL running' },
    { label: 'API Errors', value: '0.14%', icon: <Bug className="w-5 h-5" />, badge: { label: 'Watch', tone: 'danger' as Tone } },
  ];

  const quickActions = [
    { label: 'Rerun Failed Jobs', icon: <RefreshCw className="w-4 h-4" />, onClick: () => onNavigate?.('reports') },
    { label: 'Open Incident Room', icon: <ShieldAlert className="w-4 h-4" />, onClick: () => onNavigate?.('reports') },
    { label: 'View CPU/Memory', icon: <Cpu className="w-4 h-4" />, onClick: () => onNavigate?.('reports') },
  ];

  const activities = [
    { title: 'ETL pipeline restarted', subtitle: 'Geo ingestion job resumed', timestamp: '5 mins ago', status: 'info' as Tone },
    { title: 'Incident #223 mitigated', subtitle: 'Cache layer failover', timestamp: '40 mins ago', status: 'success' as Tone },
    { title: 'API 500 spike detected', subtitle: 'Investigating region-us-east', timestamp: '1 hour ago', status: 'warning' as Tone },
  ];

  const notifications = [
    { title: 'Ping: Region-us-east latency above SLO', time: 'Just now', type: 'warning' as Tone },
    { title: 'Failover test scheduled tonight', time: '1 hour ago', type: 'info' as Tone },
    { title: 'Auto-heal executed for cache nodes', time: 'Today', type: 'success' as Tone },
  ];

  return (
    <DashboardShell
      title="System Health"
      subtitle="Monitor uptime, incidents, queues, and errors."
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Dashboard"
      onNavigate={onNavigate}
    />
  );
}
