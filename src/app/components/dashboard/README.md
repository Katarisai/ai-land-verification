# Dashboard Shell

This folder provides a reusable `DashboardShell` plus dashboard presets (Seller, Buyer, Verifier, Financial, Documents, System Health, Legal, Environmental). Each preset supplies the same layout: left rail nav, hero, KPI cards, activity feed, quick actions, and notifications.

## Usage

```tsx
import { SellerDashboard } from './components/dashboard';

function Page() {
  return <SellerDashboard />;
}
```

To build a new dashboard, supply your own data:

```tsx
import { DashboardShell } from './components/dashboard';
import { MapPin } from 'lucide-react';

const kpis = [{ label: 'Active Listings', value: 5, icon: <MapPin className="w-5 h-5" /> }];
const quickActions = [{ label: 'Add Listing', icon: <MapPin className="w-4 h-4" /> }];
const activities = [{ title: 'Listing updated', subtitle: 'Portland, OR', timestamp: '1h ago' }];
const notifications = [{ title: 'AI report ready', time: 'Now' }];

function CustomDashboard() {
  return (
    <DashboardShell
      title="Custom Dashboard"
      subtitle="Your subtitle"
      kpis={kpis}
      quickActions={quickActions}
      activities={activities}
      notifications={notifications}
      activeNav="Dashboard"
    />
  );
}
```
