import { ReactNode } from 'react';
import {
  LayoutDashboard,
  FileText,
  Bell,
  Settings,
  Home,
  MapPin,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export type Tone = 'success' | 'info' | 'warning' | 'danger';

export interface KpiCardData {
  label: string;
  value: string | number;
  icon: ReactNode;
  badge?: { label: string; tone: Tone };
  helper?: string;
  onClick?: () => void;
}

export interface QuickAction {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
}

export interface ActivityItemData {
  title: string;
  subtitle: string;
  timestamp: string;
  status?: Tone;
}

export interface NotificationItemData {
  title: string;
  time: string;
  type?: Tone;
}

interface DashboardShellProps {
  title: string;
  subtitle: string;
  kpis: KpiCardData[];
  quickActions: QuickAction[];
  activities: ActivityItemData[];
  notifications: NotificationItemData[];
  activeNav?: string;
  children?: ReactNode;
  onNavigate?: (page: string) => void;
  navMapping?: Record<string, string>;
}

const toneStyles: Record<Tone, { text: string; bg: string; dot: string }> = {
  success: { text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  info: { text: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  warning: { text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  danger: { text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
};

function ToneBadge({ tone, label }: { tone: Tone; label: string }) {
  const style = toneStyles[tone];
  return (
    <Badge className={`${style.bg} ${style.text} border-0`}>{label}</Badge>
  );
}

function KpiCard({ label, value, icon, badge, helper, onClick }: KpiCardData) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition-all duration-200 ${
        onClick ? 'hover:shadow-md hover:scale-105 cursor-pointer' : ''
      }`}
    >
      <Card className="shadow-sm border-0 bg-white/70 backdrop-blur">
        <CardContent className="p-5 flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-semibold text-gray-900">{value}</p>
              {badge && <ToneBadge tone={badge.tone} label={badge.label} />}
            </div>
            {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
          </div>
          <div className="p-3 rounded-full bg-gray-100 text-gray-700">{icon}</div>
        </CardContent>
      </Card>
    </button>
  );
}

function QuickActionButton({ label, icon, onClick, href }: QuickAction) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full bg-orange-50 text-orange-600">{icon}</div>
      <span className="font-medium">{label}</span>
    </div>
  );

  if (href) {
    return (
      <Button variant="ghost" className="w-full justify-start" asChild>
        <a href={href}>{content}</a>
      </Button>
    );
  }

  return (
    <Button variant="ghost" className="w-full justify-start" onClick={onClick}>
      {content}
    </Button>
  );
}

function ActivityItem({ title, subtitle, timestamp, status }: ActivityItemData) {
  const tone = status ?? 'info';
  const style = toneStyles[tone];
  return (
    <div className="flex items-start justify-between py-3">
      <div>
        <div className="font-medium text-gray-900 flex items-center gap-2">
          <span>{title}</span>
          <span className={`inline-flex items-center gap-1 text-xs ${style.text}`}>
            <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
            {tone.charAt(0).toUpperCase() + tone.slice(1)}
          </span>
        </div>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{timestamp}</span>
    </div>
  );
}

function NotificationItem({ title, time, type = 'info' }: NotificationItemData) {
  const style = toneStyles[type];
  return (
    <div className="flex items-start gap-3 py-2">
      <span className={`mt-1 w-2 h-2 rounded-full ${style.dot}`}></span>
      <div>
        <p className="text-sm text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

export function DashboardShell({
  title,
  subtitle,
  kpis,
  quickActions,
  activities,
  notifications,
  activeNav = 'Dashboard',
  children,
  onNavigate,
  navMapping,
}: DashboardShellProps) {
  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Properties', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'AI Reports', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Inquiries', icon: <MessageCircle className="w-4 h-4" /> },
    { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const targetByLabel = navMapping ?? {
    Dashboard: 'dashboard',
    Properties: 'listings',
    Documents: 'documents',
    'AI Reports': 'reports',
    Inquiries: 'work-reports',
    Settings: 'settings',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      <div className="flex">
        {/* Left rail */}
        <aside className="hidden lg:flex w-60 flex-col min-h-screen bg-white/90 backdrop-blur border-r">
          <div className="px-6 py-6 border-b">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Home className="w-5 h-5 text-orange-500" />
              <span>AI Land</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.label === activeNav ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 ${item.label === activeNav ? 'bg-orange-50 text-orange-700' : 'text-gray-700'}`}
                onClick={() => onNavigate?.(targetByLabel[item.label] ?? 'dashboard')}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="px-4 py-6 border-t">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
          {/* Hero */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Overview</p>
              <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
              <p className="text-gray-600">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Bell className="w-4 h-4" />
                Alerts
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>

          {/* Main content */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {activities.map((item) => (
                    <ActivityItem key={item.title + item.timestamp} {...item} />
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickActions.map((action) => (
                    <QuickActionButton key={action.label} {...action} />
                  ))}
                </CardContent>
              </Card>

              {children}
            </div>

            <div className="space-y-4">
              <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {notifications.map((item) => (
                    <NotificationItem key={item.title + item.time} {...item} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
