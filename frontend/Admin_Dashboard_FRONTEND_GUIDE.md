# Admin Dashboard - Frontend Integration Guide

## Installation & Setup

### Prerequisites
- React 18+
- TypeScript
- shadcn/ui components installed
- Recharts for data visualization

### Component Installation

1. **Install Required Dependencies**
```bash
npm install recharts
npm install @shadcn/ui
```

2. **Import Components in App.tsx**

```typescript
import AdminDashboard from './app/components/AdminDashboard';
import AdminUserManagement from './app/components/AdminUserManagement';
import AdminVerificationManagement from './app/components/AdminVerificationManagement';
import AdminComplianceAudit from './app/components/AdminComplianceAudit';
import AdminReportsAnalytics from './app/components/AdminReportsAnalytics';
```

3. **Setup Routing**

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/admin/verifications" element={<AdminVerificationManagement />} />
        <Route path="/admin/compliance" element={<AdminComplianceAudit />} />
        <Route path="/admin/reports" element={<AdminReportsAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

## Component Usage

### AdminDashboard

Main landing page for admin users with KPIs and recent activity.

**Features:**
- Dashboard statistics
- User distribution
- Verification status breakdown
- Recent activity feed
- Performance metrics

**Example:**
```typescript
import AdminDashboard from './app/components/AdminDashboard';

export default function AdminPage() {
  return <AdminDashboard />;
}
```

---

### AdminUserManagement

User management interface with role assignment and deactivation.

**Features:**
- Search and filter users
- Sort by role, date joined
- Update user roles
- Deactivate user accounts
- Bulk operations support

**Example:**
```typescript
import AdminUserManagement from './app/components/AdminUserManagement';

export default function UsersPage() {
  return <AdminUserManagement />;
}
```

**Props:**
- None (fetches data from API)

**State Management:**
- Uses local state for filters and pagination
- Fetches from `/api/admin/users`

---

### AdminVerificationManagement

Manage and review land verification submissions.

**Features:**
- Filter by status (pending, in-progress, completed, rejected)
- View verification details
- Assign verifiers
- Approve/Reject verifications
- Trust score display
- Color-coded status indicators

**Example:**
```typescript
import AdminVerificationManagement from './app/components/AdminVerificationManagement';

export default function VerificationsPage() {
  return <AdminVerificationManagement />;
}
```

**API Calls:**
```typescript
// Fetch verifications
GET /api/admin/verifications?status=pending&page=1&limit=10

// Approve verification
POST /api/admin/verifications/:id/approve
Body: { trustScore, documentClarity, ... }

// Reject verification
POST /api/admin/verifications/:id/reject
Body: { rejectionReason }
```

---

### AdminComplianceAudit

Audit logs and dispute management.

**Features:**
- View audit logs with filters
- Track admin activities
- Manage user disputes
- Update dispute status
- Add comments to disputes
- Priority-based filtering

**Tabs:**
1. **Audit Logs** - All system activities
2. **Disputes** - User disputes and appeals

**Example:**
```typescript
import AdminComplianceAudit from './app/components/AdminComplianceAudit';

export default function CompliancePage() {
  return <AdminComplianceAudit />;
}
```

---

### AdminReportsAnalytics

Analytics and reporting dashboard.

**Features:**
- Trust score distribution
- Factor analysis charts
- Date range filtering
- Statistical summaries
- Visual trend analysis

**Charts Included:**
- Trust score distribution histogram
- Scoring factors bar chart
- Verification status pie chart
- User engagement trends

**Example:**
```typescript
import AdminReportsAnalytics from './app/components/AdminReportsAnalytics';

export default function ReportsPage() {
  return <AdminReportsAnalytics />;
}
```

---

## API Integration

### Authentication

Add interceptor to include auth token:

```typescript
// utils/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Protected Routes

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin' && user.role !== 'super-admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

// Usage
<Route 
  path="/admin/users" 
  element={
    <AdminRoute>
      <AdminUserManagement />
    </AdminRoute>
  } 
/>
```

---

## State Management

### Using Context API (Recommended)

```typescript
// context/AdminContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AdminContextType {
  selectedVerification: any;
  setSelectedVerification: (v: any) => void;
  filters: Record<string, any>;
  setFilters: (f: Record<string, any>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }) {
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [filters, setFilters] = useState({});

  return (
    <AdminContext.Provider
      value={{
        selectedVerification,
        setSelectedVerification,
        filters,
        setFilters,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
```

### Using Redux (Alternative)

```typescript
// store/slices/adminSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    selectedVerification: null,
    filters: {},
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedVerification: (state, action) => {
      state.selectedVerification = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export default adminSlice.reducer;
```

---

## Styling & Customization

### Theme Colors

```typescript
// constants/adminColors.ts
export const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export const roleColors = {
  admin: 'bg-red-100 text-red-800',
  legal: 'bg-blue-100 text-blue-800',
  buyer: 'bg-green-100 text-green-800',
  seller: 'bg-purple-100 text-purple-800',
};

export const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};
```

### Custom Hooks

```typescript
// hooks/useAdmin.ts
import { useState, useCallback } from 'react';

export function useFetchVerifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/admin/verifications?${params}`);
      const json = await res.json();
      setData(json.verifications);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, fetch };
}

export function useApproveVerification() {
  const [loading, setLoading] = useState(false);

  const approve = useCallback(async (verificationId, details) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/verifications/${verificationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      return await res.json();
    } finally {
      setLoading(false);
    }
  }, []);

  return { approve, loading };
}
```

---

## Error Handling

```typescript
// utils/errorHandler.ts
export function handleApiError(error: any) {
  if (error.response?.status === 403) {
    return 'Access denied. Admin privileges required.';
  }
  if (error.response?.status === 404) {
    return 'Resource not found.';
  }
  if (error.response?.status === 400) {
    return error.response.data?.message || 'Invalid input.';
  }
  return 'An error occurred. Please try again.';
}

// Usage in component
try {
  await approveVerification(id, data);
} catch (error) {
  const message = handleApiError(error);
  showErrorNotification(message);
}
```

---

## Performance Optimization

### Memoization

```typescript
import { memo } from 'react';

const VerificationRow = memo(({ verification, onApprove }) => {
  return (
    <tr>
      <td>{verification.userId.name}</td>
      <td>{verification.trustScore}</td>
      <td>
        <Button onClick={() => onApprove(verification._id)}>Approve</Button>
      </td>
    </tr>
  );
});

VerificationRow.displayName = 'VerificationRow';
```

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./AdminDashboard'));
const AdminUsers = lazy(() => import('./AdminUserManagement'));

<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

### Data Caching

```typescript
// hooks/useCache.ts
import { useRef, useCallback } from 'react';

export function useCachedData(fetchFn, cacheTime = 5 * 60 * 1000) {
  const cacheRef = useRef({ data: null, timestamp: 0 });

  const fetchData = useCallback(async () => {
    const now = Date.now();
    if (cacheRef.current.data && now - cacheRef.current.timestamp < cacheTime) {
      return cacheRef.current.data;
    }

    const data = await fetchFn();
    cacheRef.current = { data, timestamp: now };
    return data;
  }, [fetchFn, cacheTime]);

  return { fetchData };
}
```

---

## Testing

### Unit Tests

```typescript
// __tests__/AdminDashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard';

describe('AdminDashboard', () => {
  it('should render dashboard stats', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// __tests__/AdminUserManagement.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminUserManagement from '../AdminUserManagement';

describe('AdminUserManagement Integration', () => {
  it('should update user role', async () => {
    render(<AdminUserManagement />);
    
    const roleSelect = await screen.findByDisplayValue('buyer');
    fireEvent.change(roleSelect, { target: { value: 'seller' } });
    
    await waitFor(() => {
      expect(screen.getByText(/User updated successfully/i)).toBeInTheDocument();
    });
  });
});
```

---

## Best Practices

1. **Error Boundaries**
```typescript
<ErrorBoundary>
  <AdminDashboard />
</ErrorBoundary>
```

2. **Loading States**
```typescript
{loading && <Skeleton className="h-20 w-full" />}
{error && <Alert variant="destructive">{error}</Alert>}
{data && <Content data={data} />}
```

3. **Debouncing Search**
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  fetchUsers(debouncedSearch);
}, [debouncedSearch]);
```

4. **Confirmation Dialogs**
```typescript
const [showConfirm, setShowConfirm] = useState(false);

const handleDeactivate = async () => {
  if (!window.confirm('Are you sure?')) return;
  await deactivateUser(userId);
};
```
