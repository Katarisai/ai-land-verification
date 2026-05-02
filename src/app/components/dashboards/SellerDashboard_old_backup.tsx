import { useState } from 'react';
import {
  MapPin,
  Search,
  MessageCircle,
  Inbox,
  Wallet,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Filter,
  Map,
  Home,
  Compass,
  MoreVertical,
  Bed,
  DollarSign,
  TrendingUp,
  Clock3,
  FileText,
  ShieldCheck,
  Handshake,
  Banknote,
  History,
  AlertTriangle,
  Globe2,
  Sparkles,
  FolderOpen,
  CheckCircle2,
  Users,
  Lock,
  Calendar,
  Download,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import {
  ComposedChart,
  BarChart,
  LineChart,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  Line,
  Bar,
  Tooltip,
} from 'recharts';

// Type definitions
export type Tone = 'success' | 'warning' | 'info' | 'danger';
export type PropertyStatus = 'published' | 'pending' | 'draft' | 'rejected';
export type StatusTone = 'success' | 'warning' | 'info' | 'danger';

// Status tone class mapping
const statusToneClass: Record<StatusTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
  danger: 'bg-rose-50 text-rose-700 border-rose-100',
};

// Placeholder components - replace with actual dashboard components
const DashboardShell = ({ 
  title, 
  subtitle, 
  kpis, 
  quickActions, 
  activities, 
  notifications, 
  activeNav, 
  onNavigate, 
  onLogout,
  children 
}: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition font-medium"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
    {children}
  </div>
);

interface SellerDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  currency?: string;
  units?: string;
  language?: string;
}

interface Property {
  id: string;
  name: string;
  price: string;
  location: string;
  image: string;
  beds?: number;
  baths?: number;
  sqft?: string;
}

interface Message {
  id: string;
  name: string;
  message: string;
  avatar: string;
  time: string;
}

export function SellerDashboard({ onNavigate, onLogout, currency = 'USD', units = 'Acres', language = 'EN' }: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'rent' | 'compare'>('buy');
  const [activeFilter, setActiveFilter] = useState<'recommended' | 'popular' | 'newest'>('recommended');
  const [searchQuery, setSearchQuery] = useState('');

  // KPIs data
  const kpis = [
    { label: 'Total Listings', value: '5', change: '+2 this month', status: 'success' as Tone },
    { label: 'Active Leads', value: '12', change: '+3 pending', status: 'warning' as Tone },
    { label: 'Total Offers', value: '6', change: '3 negotiating', status: 'info' as Tone },
    { label: 'Monthly Payout', value: '$25,600', change: '+$4,200 YoM', status: 'success' as Tone },
  ];

  // Quick actions
  const quickActions = [
    { label: 'Publish Listing', icon: '📄', color: 'blue' },
    { label: 'Add Property', icon: '🏠', color: 'green' },
    { label: 'View Analytics', icon: '📊', color: 'orange' },
    { label: 'Message Buyer', icon: '💬', color: 'purple' },
  ];

  // Sample properties data
  const properties: Property[] = [
    {
      id: '1',
      name: 'The Stables',
      price: '$9,540.99',
      location: 'Terry Lane, Golden CO 80403',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
      beds: 4,
      baths: 3,
      sqft: '3,200'
    },
    {
      id: '2',
      name: 'The Old Rectory',
      price: '$5,999.99',
      location: 'Yale Street, Arvada CO 80007',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      beds: 3,
      baths: 2,
      sqft: '2,500'
    },
    {
      id: '3',
      name: 'Holly Cottage',
      price: '$2,998.99',
      location: 'Alice Court, Annapolis MD 21401',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      beds: 3,
      baths: 2,
      sqft: '1,800'
    },
    {
      id: '4',
      name: 'Meadow View',
      price: '$3,940.99',
      location: 'Dianne Street, Fremont CA 94538',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      beds: 4,
      baths: 3,
      sqft: '2,800'
    },
    {
      id: '5',
      name: 'Greenacres',
      price: '$5,999.99',
      location: 'Terry Lane, Golden CO 80403',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
      beds: 5,
      baths: 4,
      sqft: '4,200'
    },
    {
      id: '6',
      name: 'White Cottage',
      price: '$2,998.99',
      location: 'Yale Street, Arvada CO 80007',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop',
      beds: 3,
      baths: 2,
      sqft: '2,100'
    },
  ];

  // Recent messages
  const recentMessages: Message[] = [
    {
      id: '1',
      name: 'James Benny',
      message: 'Hey, Let me know if you\'re still available...',
      avatar: 'JB',
      time: '2m ago'
    },
    {
      id: '2',
      name: 'William Chynta',
      message: 'Great property!',
      avatar: 'WC',
      time: '1h ago'
    },
    {
      id: '3',
      name: 'Henry David',
      message: 'Alright I\'ll get back to you ASAP',
      avatar: 'HD',
      time: '3h ago'
    },
    {
      id: '4',
      name: 'Charlotte Flor',
      message: 'Sounds good buddy',
      avatar: 'CF',
      time: '1d ago'
    },
  ];

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', active: true, onClick: () => {} },
    { icon: <Compass className="w-5 h-5" />, label: 'Discover', onClick: () => onNavigate?.('discover') },
    { icon: <Inbox className="w-5 h-5" />, label: 'Inbox', badge: '3', onClick: () => onNavigate?.('inbox') },
    { icon: <Wallet className="w-5 h-5" />, label: 'My Wallet', onClick: () => onNavigate?.('wallet') },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', onClick: () => onNavigate?.('analytics') },
    { icon: <Bell className="w-5 h-5" />, label: 'Notifications', badge: '6', badgeColor: 'bg-green-500', onClick: () => onNavigate?.('notifications') },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', onClick: () => onNavigate?.('settings') },
    { icon: <LogOut className="w-5 h-5" />, label: 'Logout', onClick: () => onLogout?.(), danger: true },
  ];

  const activities = [
    { title: 'Buyer offer received on Fresno listing', subtitle: 'Counter-offer requested', timestamp: '45 mins ago', status: 'warning' as Tone },
    { title: 'Verification approved: Miami commercial lot', subtitle: 'Docs certified', timestamp: '4 hours ago', status: 'success' as Tone },
    { title: 'Payout scheduled: Week 02', subtitle: '$6,800 to Chase ****2211', timestamp: 'Today', status: 'info' as Tone },
  ];

  const notifications = [
    { title: '4 listings missing utility bill proof', time: 'Just now', type: 'warning' as Tone },
    { title: 'AI risk report updated for Austin plot', time: '1 hour ago', type: 'info' as Tone },
    { title: 'Offer signed: Riverside 3.5 acres', time: 'Yesterday', type: 'success' as Tone },
  ];

  const listings = [
    { id: '1', name: '5.2 Acres Agricultural Land', status: 'published' as PropertyStatus, verification: 'Approved', leads: 12, offers: 3, updated: '2h ago', tone: 'success' as StatusTone, views: 1950, saves: 310 },
    { id: '2', name: '2.8 Acres Residential Plot', status: 'pending' as PropertyStatus, verification: 'Awaiting deed', leads: 5, offers: 1, updated: '1d ago', tone: 'warning' as StatusTone, views: 850, saves: 95 },
    { id: '3', name: '10 Acres Commercial Land', status: 'published' as PropertyStatus, verification: 'Approved', leads: 8, offers: 2, updated: '3d ago', tone: 'success' as StatusTone, views: 1680, saves: 240 },
    { id: '4', name: '15 Acres Forest Land', status: 'draft' as PropertyStatus, verification: 'Docs missing', leads: 0, offers: 0, updated: 'Unpublished', tone: 'info' as StatusTone, views: 0, saves: 0 },
    { id: '5', name: '3.5 Acres Mixed Use', status: 'rejected' as PropertyStatus, verification: 'Resubmit survey', leads: 1, offers: 0, updated: '2d ago', tone: 'danger' as StatusTone, views: 320, saves: 28 },
  ];

  const verificationSteps = [
    { title: 'Ownership & ID', requirement: 'Title deed, government ID', status: 'Complete', progress: 100, tone: 'success' as StatusTone },
    { title: 'Zoning & permits', requirement: 'Zoning letter, permit history', status: 'Pending docs', progress: 55, tone: 'warning' as StatusTone },
    { title: 'Encumbrance search', requirement: 'Lien / mortgage statement', status: 'In review', progress: 70, tone: 'info' as StatusTone },
    { title: 'Environmental', requirement: 'Soil, flood, wetland', status: 'Not started', progress: 10, tone: 'danger' as StatusTone },
  ];

  const leads = [
    { buyer: 'Acme Builders', listing: 'Austin Residential Plot', stage: 'New', response: '15m', sla: 'On track' },
    { buyer: 'Willow Investments', listing: 'Commercial Land Miami', stage: 'Qualified', response: '34m', sla: 'At risk' },
    { buyer: 'Private Buyer', listing: 'Agricultural Land Fresno', stage: 'Offer pending', response: '1h 10m', sla: 'Breach' },
  ];

  const offers = [
    { listing: 'Fresno 5.2 Acres', buyer: 'Private Buyer', status: 'Counter', value: '$132,000', updated: 'Today' },
    { listing: 'Miami 10 Acres', buyer: 'Willow Investments', status: 'Accepted', value: '$452,000', updated: 'Yesterday' },
    { listing: 'Austin 2.8 Acres', buyer: 'Acme Builders', status: 'Negotiating', value: '$94,500', updated: '3h ago' },
  ];

  const payouts = [
    { period: 'Jan Week 2', amount: '$6,800', status: 'Scheduled', eta: 'in 2d' },
    { period: 'Jan Week 1', amount: '$5,600', status: 'Paid', eta: 'Settled' },
    { period: 'Dec Month End', amount: '$11,200', status: 'Paid', eta: 'Settled' },
  ];

  const tasks = [
    { title: 'Upload wetland certificate for Oregon lot', severity: 'warning' as StatusTone, due: 'Today' },
    { title: 'Respond to Willow Investments inquiry', severity: 'info' as StatusTone, due: '1h SLA' },
    { title: 'Re-submit survey for Mixed Use lot', severity: 'danger' as StatusTone, due: 'Due' },
    { title: 'Enable 2FA for team logins', severity: 'info' as StatusTone, due: 'This week' },
  ];

  const listingPerformance = [
    { month: 'Sep', views: 1200, saves: 160, ctr: 3.2 },
    { month: 'Oct', views: 1480, saves: 210, ctr: 3.6 },
    { month: 'Nov', views: 1660, saves: 240, ctr: 3.9 },
    { month: 'Dec', views: 1810, saves: 260, ctr: 4.1 },
    { month: 'Jan', views: 1950, saves: 310, ctr: 4.6 },
  ];

  const funnelData = [
    { stage: 'Views', count: 5200 },
    { stage: 'Inquiries', count: 740 },
    { stage: 'Qualified', count: 410 },
    { stage: 'Offer', count: 180 },
    { stage: 'Closed', count: 36 },
  ];

  const verificationTimeline = [
    { month: 'Sep', submitted: 6, approved: 3, rejected: 1 },
    { month: 'Oct', submitted: 7, approved: 4, rejected: 1 },
    { month: 'Nov', submitted: 8, approved: 5, rejected: 1 },
    { month: 'Dec', submitted: 10, approved: 7, rejected: 1 },
    { month: 'Jan', submitted: 9, approved: 6, rejected: 2 },
  ];

  const payoutSummary = [
    { period: 'Week 1', amount: 5600 },
    { period: 'Week 2', amount: 6800 },
    { period: 'Week 3', amount: 7200 },
    { period: 'Week 4', amount: 6100 },
  ];

  const responseTimes = [
    { channel: 'In-app', hours: 0.4 },
    { channel: 'Email', hours: 1.2 },
    { channel: 'Phone', hours: 0.3 },
  ];

  const heatmap = [
    { region: 'California Central Valley', intensity: 82 },
    { region: 'Austin Metro', intensity: 74 },
    { region: 'Miami-Dade', intensity: 66 },
    { region: 'Phoenix East Valley', intensity: 58 },
  ];

  const topListings = [
    { title: 'Fresno 5.2 Acres', metric: 'Views', value: '1.9k', growth: '+12%' },
    { title: 'Miami 10 Acres', metric: 'Leads', value: '280', growth: '+8%' },
    { title: 'Austin 2.8 Acres', metric: 'CTR', value: '4.6%', growth: '+0.5pp' },
  ];

  const auditLog = [
    { id: '1', action: 'Price updated', property: 'Fresno 5.2 Acres', change: '$650,000 → $665,000', timestamp: '2h ago', user: 'You', severity: 'info' as StatusTone },
    { id: '2', action: 'Document uploaded', property: '2.8 Acres Residential', change: 'Survey deed', timestamp: '5h ago', user: 'You', severity: 'success' as StatusTone },
    { id: '3', action: 'Listing published', property: 'Austin plot', change: 'Draft → Published', timestamp: '1d ago', user: 'You', severity: 'info' as StatusTone },
    { id: '4', action: 'Availability changed', property: '10 Acres Commercial', change: 'Available → On Hold', timestamp: '2d ago', user: 'Team member: John', severity: 'warning' as StatusTone },
    { id: '5', action: 'Verification docs rejected', property: 'Mixed Use Land', change: 'Survey incomplete', timestamp: '3d ago', user: 'Compliance team', severity: 'danger' as StatusTone },
  ];

  const scheduledUpdates = [
    { id: '1', property: 'Fresno Agricultural', action: 'Auto-publish', scheduledTime: 'Jan 15 at 8:00 AM', status: 'pending' as StatusTone },
    { id: '2', property: 'Miami Commercial', action: 'Price drop to $425,000', scheduledTime: 'Jan 12 at 5:00 PM', status: 'pending' as StatusTone },
    { id: '3', property: 'Austin Residential', action: 'Mark unavailable', scheduledTime: 'Jan 10 at 9:00 AM', status: 'success' as StatusTone },
  ];

  return (
    <DashboardShell
      title="Seller control center"
      subtitle="Track listings, verification, offers, payouts, and buyer engagement in one view."
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  Listing performance
                </CardTitle>
                <Badge variant="outline" className="border-orange-100 text-orange-700">CTR trend +0.5pp</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  views: { label: 'Views', color: 'hsl(26, 95%, 55%)' },
                  saves: { label: 'Saves', color: 'hsl(200, 75%, 55%)' },
                  ctr: { label: 'CTR', color: 'hsl(140, 60%, 45%)' },
                }}
                className="h-[280px]"
              >
                <ComposedChart data={listingPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 6]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area yAxisId="left" type="monotone" dataKey="views" stroke="var(--color-views)" fill="var(--color-views)" fillOpacity={0.15} />
                  <Area yAxisId="left" type="monotone" dataKey="saves" stroke="var(--color-saves)" fill="var(--color-saves)" fillOpacity={0.15} />
                  <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="var(--color-ctr)" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                Leads funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: { label: 'Count', color: 'hsl(26, 95%, 55%)' },
                }}
                className="h-[260px]"
              >
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[8, 8, 2, 2]} fill="var(--color-count)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur xl:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                Verification timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  submitted: { label: 'Submitted', color: 'hsl(26, 95%, 55%)' },
                  approved: { label: 'Approved', color: 'hsl(140, 60%, 45%)' },
                  rejected: { label: 'Rejected', color: 'hsl(352, 80%, 60%)' },
                }}
                className="h-[260px]"
              >
                <LineChart data={verificationTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line dataKey="submitted" stroke="var(--color-submitted)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="approved" stroke="var(--color-approved)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="rejected" stroke="var(--color-rejected)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-orange-600" />
                Response time & SLA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {responseTimes.map((item) => (
                <div key={item.channel} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.channel}</span>
                    <span className="text-gray-500">{item.hours}h avg</span>
                  </div>
                  <Progress value={Math.min(item.hours * 40, 100)} />
                </div>
              ))}
              <div className="text-xs text-gray-500">Goal: respond under 1h for in-app and phone, 2h for email.</div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                Property list & status
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Total: {listings.length}</Badge>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">{listings.filter(l => l.status === 'published').length} Published</Badge>
                <Badge className="bg-amber-50 text-amber-700 border-amber-100">{listings.filter(l => l.status === 'pending').length} Pending</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex gap-2 text-xs">
                <button className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">Select All</button>
                <button className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">Publish Selected</button>
                <button className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">Unpublish Selected</button>
                <button className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 flex items-center gap-1"><Download className="w-3 h-3" /> Export CSV</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"><input type="checkbox" aria-label="Select all listings" /></TableHead>
                    <TableHead>Listing</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Offers</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell><input type="checkbox" aria-label={`Select ${listing.name}`} /></TableCell>
                      <TableCell className="font-medium">{listing.name}</TableCell>
                      <TableCell>
                        <Badge className={`${statusToneClass[listing.tone]} border capitalize`}>
                          {listing.status === 'pending' ? 'pending verification' : listing.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm">{listing.verification}</TableCell>
                      <TableCell className="text-sm">{listing.views.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{listing.leads}</TableCell>
                      <TableCell className="text-sm">{listing.offers}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{listing.updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                Verification workflow tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationSteps.map((step) => (
                <div key={step.title} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.requirement}</div>
                    </div>
                    <Badge className={`${statusToneClass[step.tone]} border`}>{step.status}</Badge>
                  </div>
                  <Progress value={step.progress} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-orange-600" />
                Leads & inquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.buyer} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                  <div>
                    <div className="font-medium">{lead.buyer}</div>
                    <div className="text-sm text-gray-600">{lead.listing}</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline">{lead.stage}</Badge>
                    <span className="text-gray-500">Response {lead.response}</span>
                    <Badge className={`${lead.sla === 'Breach' ? 'bg-rose-50 text-rose-700 border-rose-100' : lead.sla === 'At risk' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'} border`}>
                      {lead.sla}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="text-xs text-gray-500">Set reminders and auto-replies to keep SLAs green.</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-orange-600" />
                Offers & negotiations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {offers.map((offer) => (
                <div key={offer.listing + offer.buyer} className="rounded-lg border border-gray-100 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{offer.listing}</div>
                      <div className="text-xs text-gray-600">{offer.buyer}</div>
                    </div>
                    <Badge variant="outline" className="capitalize">{offer.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-orange-600">{offer.value}</span>
                    <span className="text-gray-500 text-xs">{offer.updated}</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <button className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Accept</button>
                    <button className="flex-1 px-2 py-1 text-xs bg-amber-50 text-amber-600 rounded hover:bg-amber-100">Counter</button>
                    <button className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200">History</button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-orange-600" />
                Payouts & transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ChartContainer
                config={{ amount: { label: 'Amount', color: 'hsl(140, 60%, 45%)' } }}
                className="h-[200px]"
              >
                <AreaChart data={payoutSummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="amount" stroke="var(--color-amount)" fill="var(--color-amount)" fillOpacity={0.15} />
                </AreaChart>
              </ChartContainer>
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Payout History</span>
                  <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <Download className="w-3 h-3" /> Export
                  </button>
                </div>
                {payouts.map((payout) => (
                  <div key={payout.period} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                    <div>
                      <div className="font-medium text-sm">{payout.period}</div>
                      <div className="text-xs text-gray-600">{payout.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{payout.amount}</div>
                      <div className="text-xs text-gray-500">{payout.eta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <History className="w-4 h-4 text-orange-600" />
                Audit log & change history
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
              <div className="text-xs text-gray-600 mb-3">Recent changes to listings, prices, documents, and settings</div>
              {auditLog.map((log) => (
                <div key={log.id} className="rounded-lg border border-gray-100 p-3 space-y-1 text-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{log.action}</div>
                      <div className="text-xs text-gray-600">{log.property}</div>
                    </div>
                    <Badge className={`${statusToneClass[log.severity]} border text-xs`}>{log.severity === 'danger' ? 'Rejected' : log.severity === 'warning' ? 'Modified' : log.severity === 'success' ? 'Uploaded' : 'Info'}</Badge>
                  </div>
                  <div className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded">{log.change}</div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                Tasks & alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div key={task.title} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                  <div className="font-medium">{task.title}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className={`${statusToneClass[task.severity]} border`}>{task.severity === 'danger' ? 'Critical' : task.severity === 'warning' ? 'Action' : 'Info'}</Badge>
                    <span className="text-gray-500">{task.due}</span>
                  </div>
                </div>
              ))}
              <div className="text-xs text-gray-500">Alerts cover missing docs, expiring listings, verification blockers, SLA breaches.</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-orange-600" />
                Geo heatmap & top listings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {heatmap.map((place) => (
                  <div key={place.region} className="rounded-lg border border-gray-100 px-3 py-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{place.region}</span>
                      <span className="text-gray-500">{place.intensity}% of leads</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-orange-100">
                      {/* style-map */}
                      <div className="h-full rounded-full bg-orange-500" style={{ width: `${place.intensity}%` } as any} title={`${place.intensity}% of leads`}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {topListings.map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-gray-600">{item.metric}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value}</div>
                      <div className="text-green-600 text-xs">{item.growth}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                Profile, KYC & compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <span className="font-medium">Identity & business KYC</span>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">Complete</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <span className="font-medium">Bank details</span>
                <Badge variant="outline">Chase ****2211</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <span className="font-medium">2FA & session management</span>
                <Badge className="bg-amber-50 text-amber-700 border border-amber-100">Enable for team</Badge>
              </div>
              <div className="rounded-lg border border-gray-100 px-3 py-2 space-y-2">
                <span className="font-medium block">Localization settings</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="px-2 py-1 bg-blue-50 rounded text-blue-700">💵 {currency}</div>
                  <div className="px-2 py-1 bg-blue-50 rounded text-blue-700">📏 {units}</div>
                  <div className="px-2 py-1 bg-blue-50 rounded text-blue-700">🌐 {language}</div>
                </div>
              </div>
              <button className="w-full px-3 py-2 text-sm border rounded hover:bg-blue-50 text-blue-600 flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" /> Edit settings
              </button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Support & help desk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border border-gray-100 p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">Open support ticket</div>
                    <div className="text-xs text-gray-600">Escalate verification blockers</div>
                  </div>
                  <Badge variant="outline" className="text-xs">Priority 2</Badge>
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-orange-600" /> Live chat support
                    </div>
                    <div className="text-xs text-gray-600">Avg response &lt; 5 min</div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-xs">Online</Badge>
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <div className="font-medium mb-2 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-orange-600" /> Help center
                </div>
                <div className="space-y-1 text-xs">
                  <div><a href="#" className="text-blue-600 hover:underline">📄 Documentation & policies</a></div>
                  <div><a href="#" className="text-blue-600 hover:underline">💰 Payout FAQ</a></div>
                  <div><a href="#" className="text-blue-600 hover:underline">⚖️ Dispute resolution</a></div>
                  <div><a href="#" className="text-blue-600 hover:underline">🎓 Seller resources</a></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              Advanced features & tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <button className="rounded-lg border border-gray-100 px-3 py-2 hover:bg-blue-50 text-left hover:border-blue-300 transition">
                <div className="font-medium text-sm">Bulk actions</div>
                <div className="text-xs text-gray-600">Publish/unpublish multiple</div>
              </button>
              <button className="rounded-lg border border-gray-100 px-3 py-2 hover:bg-blue-50 text-left hover:border-blue-300 transition">
                <div className="font-medium text-sm flex items-center gap-1"><Download className="w-3 h-3" /> CSV export</div>
                <div className="text-xs text-gray-600">Inventory & payouts</div>
              </button>
              <button className="rounded-lg border border-gray-100 px-3 py-2 hover:bg-blue-50 text-left hover:border-blue-300 transition">
                <div className="font-medium text-sm flex items-center gap-1"><History className="w-3 h-3" /> Audit log</div>
                <div className="text-xs text-gray-600">Price & doc changes</div>
              </button>
              <button className="rounded-lg border border-gray-100 px-3 py-2 hover:bg-blue-50 text-left hover:border-blue-300 transition">
                <div className="font-medium text-sm flex items-center gap-1"><Users className="w-3 h-3" /> Team roles</div>
                <div className="text-xs text-gray-600">Role-based access control</div>
              </button>
              <button className="rounded-lg border border-gray-100 px-3 py-2 hover:bg-blue-50 text-left hover:border-blue-300 transition">
                <div className="font-medium text-sm flex items-center gap-1"><Lock className="w-3 h-3" /> 2FA & sessions</div>
                <div className="text-xs text-gray-600">Enable 2FA, manage logins</div>
              </button>
              <button className="rounded-lg border border-gray-100 px-3 py-2 hover:bg-blue-50 text-left hover:border-blue-300 transition">
                <div className="font-medium text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> Scheduler</div>
                <div className="text-xs text-gray-600">Price & availability updates</div>
              </button>
              <button className="rounded-lg border border-gray-100 px-3 py-2 hover:bg-blue-50 text-left hover:border-blue-300 transition">
                <div className="font-medium text-sm flex items-center gap-1"><Globe2 className="w-3 h-3" /> Localization</div>
                <div className="text-xs text-gray-600">Currency, units, language</div>
              </button>
              <button className="rounded-lg border border-gray-100 px-3 py-2 hover:bg-blue-50 text-left hover:border-blue-300 transition">
                <div className="font-medium text-sm flex items-center gap-1"><Bell className="w-3 h-3" /> Notifications</div>
                <div className="text-xs text-gray-600">Email & in-app settings</div>
              </button>
              <button className="rounded-lg border border-gray-100 px-3 py-2 hover:bg-blue-50 text-left hover:border-blue-300 transition">
                <div className="font-medium text-sm flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Analytics</div>
                <div className="text-xs text-gray-600">Advanced performance data</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ADD NEW LAND PLOT SECTION */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Add New Land Plot Form */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                Add New Land Plot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Plot Basic Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plot Name/Title</label>
                  <Input 
                    placeholder="e.g., Agricultural Land - Fresno County"
                    className="border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Area</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g., 5.2"
                        type="number"
                        className="border-gray-300"
                      />
                      <select className="px-3 py-2 border border-gray-300 rounded-lg" aria-label="Area unit">
                        <option>Acres</option>
                        <option>Hectares</option>
                        <option>Sq Feet</option>
                        <option>Sq Meters</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="0.00"
                        type="number"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Land Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" aria-label="Land type selection">
                    <option>Select land type...</option>
                    <option>Agricultural</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                    <option>Mixed Use</option>
                    <option>Forest Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    placeholder="Describe the land plot features, amenities, access routes, etc."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Survey Number / Plot ID</label>
                  <Input 
                    placeholder="e.g., SY-12345-67"
                    className="border-gray-300"
                  />
                </div>

                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                  Save Plot Details
                </button>
              </div>
            </CardContent>
          </Card>

          {/* GPS Navigation & Real-time Location */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-orange-600" />
                GPS Navigation & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* GPS Map Placeholder */}
              <div className="w-full h-[250px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <p className="text-sm font-medium mb-2">📍 GPS Map View</p>
                  <p className="text-xs">Interactive map with location marking</p>
                </div>
              </div>

              {/* GPS Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <label className="text-xs text-gray-600 font-medium">Latitude</label>
                  <input 
                    type="number" 
                    placeholder="28.6139"
                    step="0.000001"
                    className="w-full text-sm font-mono border-0 bg-transparent p-0 mt-1"
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <label className="text-xs text-gray-600 font-medium">Longitude</label>
                  <input 
                    type="number" 
                    placeholder="77.2090"
                    step="0.000001"
                    className="w-full text-sm font-mono border-0 bg-transparent p-0 mt-1"
                  />
                </div>
              </div>

              {/* GPS Controls */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 text-sm font-medium flex items-center justify-center gap-2">
                  📍 Get Current Location
                </button>
                <button className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 border border-purple-200 text-sm font-medium flex items-center justify-center gap-2">
                  🗺️ Set on Map
                </button>
              </div>

              {/* Manual Visit Tracking */}
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Manual Site Visits</label>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Live</Badge>
                </div>
                <div className="text-xs space-y-1 text-gray-600">
                  <p>✓ Last visit: 2h ago</p>
                  <p>✓ Distance traveled: 2.4 km</p>
                  <p>✓ GPS accuracy: ±5 meters</p>
                  <button className="mt-2 w-full px-2 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700">
                    Start Site Visit
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents & Files Management */}
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              Land Documents & Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Document Upload Area */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl">📄</div>
                <div className="font-medium text-gray-700">Upload Documents</div>
                <div className="text-xs text-gray-600">Drag & drop or click to upload</div>
                <input type="file" multiple className="hidden" aria-label="Upload land documents" />
              </div>
            </div>

            {/* Document Types */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 text-xs">
              {[
                { label: '📋 Title Deed', status: 'pending' },
                { label: '🗂️ Survey Report', status: 'uploaded' },
                { label: '⚖️ Zoning Certificate', status: 'missing' },
                { label: '🏗️ Permits', status: 'pending' },
                { label: '🌍 Map/Boundaries', status: 'uploaded' },
                { label: '💧 Environmental', status: 'missing' },
                { label: '🏦 Bank Statement', status: 'uploaded' },
                { label: '📝 Ownership Proof', status: 'pending' },
              ].map((doc, idx) => (
                <button 
                  key={idx}
                  className={`p-3 rounded-lg border text-center transition ${
                    doc.status === 'uploaded' ? 'bg-emerald-50 border-emerald-200' :
                    doc.status === 'pending' ? 'bg-amber-50 border-amber-200' :
                    'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="font-medium">{doc.label}</div>
                  <Badge 
                    className={`mt-1 text-xs ${
                      doc.status === 'uploaded' ? 'bg-emerald-100 text-emerald-700' :
                      doc.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {doc.status}
                  </Badge>
                </button>
              ))}
            </div>

            {/* Uploaded Documents List */}
            <div className="space-y-2">
              <div className="font-medium text-sm">Recently Uploaded Documents</div>
              {[
                { name: 'Land_Survey_Report.pdf', size: '2.4 MB', date: '2 days ago', verified: true },
                { name: 'Ownership_Document.pdf', size: '1.8 MB', date: '1 week ago', verified: true },
                { name: 'Map_Boundaries.png', size: '5.2 MB', date: '1 week ago', verified: false },
              ].map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">📎</div>
                    <div className="text-sm">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-gray-600">{file.size} • {file.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.verified && <Badge className="bg-emerald-100 text-emerald-700">Verified</Badge>}
                    <button className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">Download</button>
                    <button className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Land Images & Gallery */}
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Map className="w-4 h-4 text-orange-600" />
              Land Images & Photo Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50 hover:bg-green-100 transition cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">📸</div>
                <div className="font-medium text-gray-700">Upload Land Images</div>
                <div className="text-xs text-gray-600">Add photos from different angles & GPS locations</div>
                <input type="file" accept="image/*" multiple className="hidden" aria-label="Upload land images with GPS data" />
              </div>
            </div>

            {/* Image Gallery Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[
                { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop', name: 'North Entry', gps: '28.6139, 77.2090', date: '2h ago' },
                { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=300&h=300&fit=crop', name: 'West Boundary', gps: '28.6140, 77.2089', date: '2h ago' },
                { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=300&h=300&fit=crop', name: 'East Side', gps: '28.6138, 77.2091', date: '2h ago' },
                { url: 'https://images.unsplash.com/photo-1600612027873-d437e2c1f49a?w=300&h=300&fit=crop', name: 'South Area', gps: '28.6137, 77.2090', date: '1h ago' },
                { url: 'https://images.unsplash.com/photo-1600566749712-6ccc0b39bf90?w=300&h=300&fit=crop', name: 'Land Overview', gps: '28.6139, 77.2090', date: '1h ago' },
                { url: 'https://images.unsplash.com/photo-1600596659160-b89dc6e56217?w=300&h=300&fit=crop', name: 'Infrastructure', gps: '28.6140, 77.2088', date: '3h ago' },
              ].map((image, idx) => (
                <div key={idx} className="group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition">
                  <img 
                    src={image.url} 
                    alt={image.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2">
                    <div className="text-white text-xs">
                      <div className="font-medium">{image.name}</div>
                      <div className="text-gray-300 text-xs">📍 {image.gps}</div>
                      <div className="text-gray-400 text-xs">{image.date}</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition">
                    <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">View</button>
                    <button className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Metadata & GPS Info */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Image Analytics</div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>✓ Total Images: 6</p>
                  <p>✓ 360° Coverage: Yes</p>
                  <p>✓ GPS Tagged: 100%</p>
                  <p>✓ Average Quality: HD (1920x1440)</p>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Coverage Map</div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>📍 North: ✓ Covered</p>
                  <p>📍 South: ✓ Covered</p>
                  <p>📍 East: ✓ Covered</p>
                  <p>📍 West: ✓ Covered</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
