import {
  Bookmark,
  FileCheck2,
  Handshake,
  CalendarClock,
  CalendarCheck,
  Sparkles,
  FileSearch,
} from 'lucide-react';
import { DashboardShell, Tone } from './DashboardShell';

interface BuyerDashboardProps {
  onNavigate?: (page: string) => void;
}

export function BuyerDashboard({ onNavigate }: BuyerDashboardProps) {
  const kpis = [
    { label: 'Saved Listings', value: 12, icon: <Bookmark className="w-5 h-5" /> },
    { label: 'Verified Docs', value: 28, icon: <FileCheck2 className="w-5 h-5" />, badge: { label: 'Secure', tone: 'success' as Tone } },
    { label: 'Offers', value: 4, icon: <Handshake className="w-5 h-5" />, helper: '2 counter-offers pending' },
    { label: 'Appointments', value: 3, icon: <CalendarClock className="w-5 h-5" />, badge: { label: 'Today', tone: 'info' as Tone } },
  ];

  const quickActions = [
    { label: 'Book Site Visit', icon: <CalendarCheck className="w-4 h-4" />, onClick: () => onNavigate?.('schedule') },
    { label: 'Start Verification', icon: <Sparkles className="w-4 h-4" />, onClick: () => onNavigate?.('documents') },
    { label: 'Search Documents', icon: <FileSearch className="w-4 h-4" />, onClick: () => onNavigate?.('documents') },
  ];

  const activities = [
    { title: 'Saved: 4.5 Acres Riverside Plot', subtitle: 'Portland, OR', timestamp: '1 hour ago', status: 'info' as Tone },
    { title: 'Offer sent: Hilltop Ranch', subtitle: 'Boise, ID', timestamp: 'Yesterday', status: 'success' as Tone },
    { title: 'Verification requested: Coastal Lot', subtitle: 'Santa Cruz, CA', timestamp: '2 days ago', status: 'warning' as Tone },
  ];

  const notifications = [
    { title: 'Seller accepted meeting for Hilltop Ranch', time: '30 mins ago', type: 'success' as Tone },
    { title: 'New AI report ready for Riverside Plot', time: '1 hour ago', type: 'info' as Tone },
    { title: 'Document update: Coastal Lot needs deed copy', time: '2 days ago', type: 'warning' as Tone },
  ];

  return (
    <DashboardShell
      title="Welcome back, Buyer"
      subtitle="Track your saved listings, offers, and verification steps."
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Dashboard"
      onNavigate={onNavigate}
    />
  );
}
