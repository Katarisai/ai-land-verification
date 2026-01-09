import {
  Wallet,
  RotateCcw,
  CreditCard,
  TrendingUp,
  Download,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { DashboardShell, Tone } from './DashboardShell';

interface FinancialDashboardProps {
  onNavigate?: (page: string) => void;
}

export function FinancialDashboard({ onNavigate }: FinancialDashboardProps) {
  const kpis = [
    { label: 'Revenue (MTD)', value: '$128,400', icon: <TrendingUp className="w-5 h-5" />, badge: { label: '+12%', tone: 'success' as Tone } },
    { label: 'Pending Payouts', value: '$34,200', icon: <Wallet className="w-5 h-5" />, badge: { label: '12 items', tone: 'warning' as Tone } },
    { label: 'Refunds', value: '$4,800', icon: <RotateCcw className="w-5 h-5" />, helper: '2 pending approvals' },
    { label: 'A/R Balance', value: '$18,900', icon: <CreditCard className="w-5 h-5" />, badge: { label: 'Aging', tone: 'danger' as Tone } },
  ];

  const quickActions = [
    { label: 'Export Transactions', icon: <Download className="w-4 h-4" />, onClick: () => onNavigate?.('reports') },
    { label: 'Reconcile Payouts', icon: <Receipt className="w-4 h-4" />, onClick: () => onNavigate?.('reports') },
    { label: 'Download Billing Report', icon: <FileSpreadsheet className="w-4 h-4" />, onClick: () => onNavigate?.('reports') },
  ];

  const activities = [
    { title: 'Payout batch #104 processed', subtitle: '12 sellers, $22,400', timestamp: '20 mins ago', status: 'success' as Tone },
    { title: 'Chargeback review: Invoice #7843', subtitle: 'Pending evidence upload', timestamp: '1 hour ago', status: 'warning' as Tone },
    { title: 'Refund issued: Buyer #9921', subtitle: '$1,200 - Completed', timestamp: 'Today', status: 'info' as Tone },
  ];

  const notifications = [
    { title: 'Billing report ready for download', time: 'Just now', type: 'info' as Tone },
    { title: 'A/R aging exceeds threshold', time: '30 mins ago', type: 'danger' as Tone },
    { title: 'Reconciliation completed for Dec 5', time: '1 hour ago', type: 'success' as Tone },
  ];

  return (
    <DashboardShell
      title="Financial Overview"
      subtitle="Track revenue, payouts, refunds, and receivables."
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Dashboard"
      onNavigate={onNavigate}
    />
  );
}
