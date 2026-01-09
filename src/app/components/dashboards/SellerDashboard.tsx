import {
  MapPin,
  FileText,
  Sparkles,
  MessageCircle,
  Plus,
  FolderOpen,
  ClipboardCheck,
} from 'lucide-react';
import { DashboardShell, Tone } from './DashboardShell';

interface SellerDashboardProps {
  onNavigate?: (page: string) => void;
}

export function SellerDashboard({ onNavigate }: SellerDashboardProps) {
  const kpis = [
    { label: 'Active Listings', value: 5, icon: <MapPin className="w-5 h-5" />, badge: { label: 'Live', tone: 'success' as Tone } },
    { label: 'Verified Docs', value: 15, icon: <FileText className="w-5 h-5" />, badge: { label: '+3 this week', tone: 'info' as Tone } },
    { label: 'AI Reports', value: 12, icon: <Sparkles className="w-5 h-5" />, helper: '3 pending updates' },
    { label: 'Inquiries', value: 18, icon: <MessageCircle className="w-5 h-5" />, badge: { label: '4 new', tone: 'warning' as Tone } },
  ];

  const quickActions = [
    { label: 'Add New Listing', icon: <Plus className="w-4 h-4" />, onClick: () => onNavigate?.('listings') },
    { label: 'View Documents', icon: <FolderOpen className="w-4 h-4" />, onClick: () => onNavigate?.('documents') },
    { label: 'Request Verification', icon: <ClipboardCheck className="w-4 h-4" />, onClick: () => onNavigate?.('reports') },
  ];

  const activities = [
    { title: '5.2 Acres Agricultural Land, California', subtitle: 'Fresno County, CA', timestamp: '2 hours ago', status: 'success' as Tone },
    { title: '2.8 Acres Residential Plot, Texas', subtitle: 'Austin, TX', timestamp: '1 day ago', status: 'warning' as Tone },
    { title: '10 Acres Commercial Land, Florida', subtitle: 'Miami, FL', timestamp: '3 days ago', status: 'success' as Tone },
  ];

  const notifications = [
    { title: 'AI verification complete for Fresno listing', time: '2 hours ago', type: 'success' as Tone },
    { title: 'Document approved: Title deed - Florida', time: '1 day ago', type: 'info' as Tone },
    { title: 'Inquiry received: Residential Plot, Texas', time: '1 day ago', type: 'warning' as Tone },
  ];

  return (
    <DashboardShell
      title="Welcome back, Sarah Seller"
      subtitle="Manage your land listings and track verification status."
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Dashboard"
      onNavigate={onNavigate}
    />
  );
}
