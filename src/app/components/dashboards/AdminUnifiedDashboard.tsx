import {
  Users,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  Scale,
  BarChart3,
  ClipboardList,
} from 'lucide-react';
import { DashboardShell, Tone } from './DashboardShell';

interface AdminUnifiedDashboardProps {
  onNavigate?: (page: string) => void;
}

export function AdminUnifiedDashboard({ onNavigate }: AdminUnifiedDashboardProps) {
  const kpis = [
    { label: 'Total Users', value: 1284, icon: <Users className="w-5 h-5" />, badge: { label: '+42 this week', tone: 'info' as Tone } },
    { label: 'Pending Verifications', value: 32, icon: <ShieldCheck className="w-5 h-5" />, badge: { label: 'Action needed', tone: 'warning' as Tone } },
    { label: 'Revenue (MTD)', value: '$182,400', icon: <DollarSign className="w-5 h-5" />, badge: { label: '+11%', tone: 'success' as Tone } },
    { label: 'Open Disputes', value: 6, icon: <AlertTriangle className="w-5 h-5" />, badge: { label: 'Review', tone: 'danger' as Tone } },
  ];

  const quickActions = [
    { label: 'Review Verifications', icon: <ShieldCheck className="w-4 h-4" />, onClick: () => onNavigate?.('reports') },
    { label: 'Manage Users', icon: <Users className="w-4 h-4" />, onClick: () => onNavigate?.('workers') },
    { label: 'View Reports', icon: <BarChart3 className="w-4 h-4" />, onClick: () => onNavigate?.('reports') },
  ];

  const activities = [
    { title: '12 verifications approved', subtitle: 'AI + human review completed', timestamp: '30 mins ago', status: 'success' as Tone },
    { title: '2 disputes escalated', subtitle: 'Need admin decision', timestamp: '1 hour ago', status: 'warning' as Tone },
    { title: 'Audit log exported', subtitle: 'Sent to compliance inbox', timestamp: 'Today', status: 'info' as Tone },
  ];

  const notifications = [
    { title: 'SLA at risk: 5 verifications >24h', time: 'Just now', type: 'danger' as Tone },
    { title: 'Monthly billing report ready', time: '1 hour ago', type: 'success' as Tone },
    { title: 'New legal rule update published', time: 'Today', type: 'info' as Tone },
  ];

  return (
    <DashboardShell
      title="Welcome back, Admin"
      subtitle="Track platform health, approvals, and revenue at a glance."
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Dashboard"
      onNavigate={onNavigate}
      navMapping={{
        Dashboard: 'dashboard',
        Properties: 'listings',
        Documents: 'documents',
        'AI Reports': 'reports',
        Inquiries: 'reports',
        Settings: 'settings',
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
          <div className="flex items-center gap-2 text-sm text-orange-700 mb-2">
            <ClipboardList className="w-4 h-4" />
            Verification Queue
          </div>
          <p className="text-3xl font-semibold text-gray-900">32</p>
          <p className="text-sm text-gray-600">5 high priority • 12 in legal review</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
          <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
            <Scale className="w-4 h-4" />
            Compliance & Disputes
          </div>
          <p className="text-3xl font-semibold text-gray-900">6 open</p>
          <p className="text-sm text-gray-600">3 awaiting admin decision • 2 scheduled</p>
        </div>
      </div>
    </DashboardShell>
  );
}
