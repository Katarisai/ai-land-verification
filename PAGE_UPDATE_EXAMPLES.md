# 📝 Page Update Examples - Adding Logout Button to Every Page

## How to Update Each Page Component

Simply wrap your component content with `<PageLayout>` - no other changes needed!

---

## Example 1: Dashboard Page

### BEFORE (Current)
```typescript
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  );
}
```

### AFTER (With Logout Button)
```typescript
import React, { useState } from 'react';
import { PageLayout } from './components/PageLayout';
import { Dashboard } from './components/Dashboard';

export function DashboardPage() {
  return (
    <PageLayout title="Dashboard" subtitle="Overview">
      <div className="p-6">
        {/* Your dashboard content */}
      </div>
    </PageLayout>
  );
}
```

**Change:** Just wrap with `<PageLayout>` - that's it!

---

## Example 2: Land Listings Page

### BEFORE
```typescript
export function LandListingsPage() {
  const [lands, setLands] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1>Land Listings</h1>
      {/* List items */}
    </div>
  );
}
```

### AFTER
```typescript
import { PageLayout } from './components/PageLayout';

export function LandListingsPage() {
  const [lands, setLands] = useState([]);

  return (
    <PageLayout title="Land Listings" subtitle="Browse Properties">
      <div className="p-6">
        {/* List items - unchanged */}
      </div>
    </PageLayout>
  );
}
```

---

## Example 3: Land Detail Page (with Chatbot)

### BEFORE
```typescript
export function LandDetailPage({ landId }: { landId: string }) {
  const { land, loading } = useLand(landId);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{land?.owner.name}'s Land</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Land details */}
        </div>
        <div>
          {/* Chatbot */}
        </div>
      </div>
    </div>
  );
}
```

### AFTER
```typescript
import { PageLayout } from './components/PageLayout';

export function LandDetailPage({ landId }: { landId: string }) {
  const { land, loading } = useLand(landId);

  return (
    <PageLayout 
      title="Land Details" 
      subtitle={`ID: ${landId}`}
    >
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Land details - unchanged */}
          </div>
          <div>
            {/* Chatbot - unchanged */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
```

---

## Example 4: Admin Dashboard

### BEFORE
```typescript
export function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>Admin Dashboard</h1>
      {/* Admin content */}
    </div>
  );
}
```

### AFTER
```typescript
import { PageLayout } from './components/PageLayout';

export function AdminDashboardPage() {
  return (
    <PageLayout title="Admin Dashboard" subtitle="Manage Platform">
      <div className="p-6">
        {/* Admin content - unchanged */}
      </div>
    </PageLayout>
  );
}
```

---

## Example 5: Settings Page

### BEFORE
```typescript
export function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>Settings</h1>
      {/* Settings content */}
    </div>
  );
}
```

### AFTER
```typescript
import { PageLayout } from './components/PageLayout';

export function SettingsPage() {
  return (
    <PageLayout title="Settings" subtitle="Manage Account">
      <div className="p-6">
        {/* Settings content - unchanged */}
      </div>
    </PageLayout>
  );
}
```

---

## Example 6: Projects/Properties Page

### BEFORE
```typescript
export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1>My Projects</h1>
      {/* Projects list */}
    </div>
  );
}
```

### AFTER
```typescript
import { PageLayout } from './components/PageLayout';

export function ProjectsPage() {
  return (
    <PageLayout title="Projects" subtitle="Manage Properties">
      <div className="p-6">
        {/* Projects list - unchanged */}
      </div>
    </PageLayout>
  );
}
```

---

## Example 7: Reports Page

### BEFORE
```typescript
export function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>Reports</h1>
      {/* Reports */}
    </div>
  );
}
```

### AFTER
```typescript
import { PageLayout } from './components/PageLayout';

export function ReportsPage() {
  return (
    <PageLayout title="Reports" subtitle="Analytics & Insights">
      <div className="p-6">
        {/* Reports - unchanged */}
      </div>
    </PageLayout>
  );
}
```

---

## Example 8: Worker/User Management Page

### BEFORE
```typescript
export function WorkersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>Workers & Staff</h1>
      {/* Worker list */}
    </div>
  );
}
```

### AFTER
```typescript
import { PageLayout } from './components/PageLayout';

export function WorkersPage() {
  return (
    <PageLayout title="Workers & Staff" subtitle="Manage Team">
      <div className="p-6">
        {/* Worker list - unchanged */}
      </div>
    </PageLayout>
  );
}
```

---

## PageLayout Props Reference

```typescript
interface PageLayoutProps {
  // Required
  children: ReactNode;  // Your page content

  // Optional
  title?: string;       // Page title (default: "AI Land Verification")
  subtitle?: string;    // Page subtitle (default: "Platform")
  showMenu?: boolean;   // Show menu toggle button (default: true)
  onMenuClick?: () => void;  // Menu click handler
  menuOpen?: boolean;   // Is menu open? (default: false)
  className?: string;   // Custom CSS class for content area
}
```

---

## Quick Copy-Paste Template

Use this template for any new page:

```typescript
import { PageLayout } from './components/PageLayout';

export function [PageName]Page() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <PageLayout 
      title="[Page Title]" 
      subtitle="[Page Subtitle]"
      showMenu={true}
      menuOpen={menuOpen}
      onMenuClick={() => setMenuOpen(!menuOpen)}
    >
      <div className="p-6">
        {/* Your page content here */}
      </div>
    </PageLayout>
  );
}
```

---

## Update Checklist - Copy & Paste

When updating pages, follow this order:

```
Pages to Update:
- [ ] Dashboard.tsx
- [ ] AdminDashboard.tsx
- [ ] LandListings.tsx
- [ ] LandDetail.tsx
- [ ] ProjectsPage.tsx
- [ ] RawMaterialsPage.tsx
- [ ] WorkersPage.tsx
- [ ] SchedulePage.tsx
- [ ] DailyReportsPage.tsx
- [ ] SettingsPage.tsx
- [ ] ViewDocuments.tsx
- [ ] ContactAgent.tsx
- [ ] [Any other pages]

For each page:
1. [ ] Import PageLayout: `import { PageLayout } from './components/PageLayout';`
2. [ ] Remove outer `<div className="min-h-screen bg-gray-50">` wrapper
3. [ ] Replace with: `<PageLayout title="..." subtitle="..."> content </PageLayout>`
4. [ ] Test - logout button should appear
5. [ ] Test logout - should work and redirect to login
```

---

## What Gets Automatically Added

When you use `<PageLayout>`, you automatically get:

✅ Header with user info  
✅ Red logout button  
✅ Notifications bell  
✅ Settings button  
✅ User role badge  
✅ Responsive design  
✅ Footer  
✅ Consistent styling  
✅ User status bar  

---

## Testing After Updates

1. **For each page:**
   ```bash
   npm run dev
   # Login
   # Navigate to page
   # Verify header appears
   # Verify logout button visible and clickable
   ```

2. **Test logout:**
   ```bash
   # Click logout button
   # Confirm dialog should appear
   # Click OK
   # Should redirect to login page
   ```

3. **Test responsive:**
   ```bash
   # Press F12 to open DevTools
   # Click mobile icon (responsive design)
   # Verify logout button still works on mobile
   ```

---

## CSS Classes You Can Use

The PageLayout already has styling, but you can customize with:

```typescript
// Add custom styles to content area
<PageLayout 
  title="Page" 
  className="bg-white p-8"
>
  {/* Content */}
</PageLayout>

// Add custom styles to individual sections
<PageLayout title="Page">
  <div className="max-w-7xl mx-auto p-6">
    {/* Centered, max-width content */}
  </div>
</PageLayout>

// Dark theme content
<PageLayout title="Page">
  <div className="bg-gray-900 text-white p-6">
    {/* Dark content */}
  </div>
</PageLayout>
```

---

## Import Statements You Need

For each page, add this import at the top:

```typescript
import { PageLayout } from './components/PageLayout';
```

Or if you want to shorten it:

```typescript
import PageLayout from './components/PageLayout';
```

---

## No Other Changes Needed!

✅ Don't change your page logic  
✅ Don't change your styling  
✅ Don't change your data fetching  
✅ Just wrap with PageLayout  
✅ Logout button automatically appears!

---

## Common Mistakes to Avoid

❌ **Wrong:** Forgetting to import PageLayout
```typescript
// Missing: import { PageLayout } from './components/PageLayout';
<PageLayout>...</PageLayout>  // This will error
```

✅ **Correct:**
```typescript
import { PageLayout } from './components/PageLayout';
<PageLayout>...</PageLayout>
```

---

❌ **Wrong:** Still using old header component
```typescript
export function DashboardPage() {
  return (
    <div>
      <DashboardShell>  {/* Old - remove this */}
        {/* Content */}
      </DashboardShell>
    </div>
  );
}
```

✅ **Correct:**
```typescript
export function DashboardPage() {
  return (
    <PageLayout title="Dashboard">  {/* New - use this */}
      {/* Content */}
    </PageLayout>
  );
}
```

---

## Need Help?

Check:
1. **LOGOUT_BUTTON_GUIDE.md** - Full logout button documentation
2. **AppHeader.tsx** - The header component code
3. **PageLayout.tsx** - The layout wrapper code
4. **This file** - More examples and customization

---

**Done! Your pages now have logout buttons on every page.** 🎉
