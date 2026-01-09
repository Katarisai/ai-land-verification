# Session Persistence - Prevent Logout on Page Refresh

## Problem
When you refresh the page, the app redirects to login instead of maintaining your session.

## Solution: Implement Session Persistence

### Step 1: Create Authentication Context with LocalStorage

Create a new file: `src/app/context/AuthContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'legal' | 'admin' | null;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newUser: User, token: string) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('authToken', token);
    localStorage.setItem('loginTime', new Date().toISOString());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginTime');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

### Step 2: Update App.tsx to Use AuthContext

```typescript
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
// ... other imports

function AppContent() {
  const { user, login, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'listings' | ...>('login');
  const [selectedLandId, setSelectedLandId] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);

  // Restore page from sessionStorage on mount
  useEffect(() => {
    if (user) {
      const savedPage = sessionStorage.getItem('currentPage');
      if (savedPage) {
        setCurrentPage(savedPage as any);
      } else {
        setCurrentPage('dashboard');
      }
    }
  }, [user]);

  // Save current page to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  // Show loading screen while checking localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show current page; otherwise show login
  if (!user) {
    return <LoginPage onLogin={(role) => {
      const mockUser = {
        id: '1',
        name: role === 'buyer' ? 'John Buyer' : role === 'seller' ? 'Sarah Seller' : 'Legal Expert',
        email: `${role}@cm.com`,
        role
      };
      login(mockUser, 'mock-token-' + Date.now());
    }} />;
  }

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
    setSelectedLandId(null);
    setShowNavigationMenu(false);
  };

  // ... rest of your page rendering logic
  return (
    <div className="flex">
      {/* Navigation */}
      {showNavigationMenu && (
        <NavigationMenu 
          onNavigate={(page) => {
            setCurrentPage(page as any);
            setShowNavigationMenu(false);
          }} 
          onClose={() => setShowNavigationMenu(false)} 
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {currentPage === 'login' && (
          <LoginPage onLogin={(role) => {
            const mockUser = {
              id: '1',
              name: role === 'buyer' ? 'John Buyer' : role === 'seller' ? 'Sarah Seller' : 'Legal Expert',
              email: `${role}@cm.com`,
              role
            };
            login(mockUser, 'mock-token-' + Date.now());
          }} />
        )}
        {currentPage === 'dashboard' && <Dashboard user={user} onLogout={handleLogout} onNavigate={(page) => setCurrentPage(page as any)} onToggleAI={() => setShowAIAssistant(!showAIAssistant)} />}
        {/* ... other pages ... */}
      </main>

      {/* AI Assistant */}
      {showAIAssistant && <AIAssistant onClose={() => setShowAIAssistant(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

---

### Step 3: Update main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## How It Works

1. **On First Login**:
   - User enters credentials and logs in
   - `AuthContext` saves user data to `localStorage`
   - Saves auth token to `localStorage`
   - Saves current page to `sessionStorage`

2. **On Page Refresh**:
   - App loads
   - `AuthContext` checks `localStorage` for saved user and token
   - If found, automatically restores user session
   - Restores previous page from `sessionStorage`
   - User stays on same page without redirecting to login

3. **On Logout**:
   - `AuthContext` clears all stored data from localStorage
   - User is redirected to login page
   - Session is completely cleared

---

## Additional Security Features

### Add Session Timeout (Optional)

```typescript
// In AuthContext.tsx - add session timeout after 30 minutes of inactivity

useEffect(() => {
  if (!user) return;

  const timeoutId = setTimeout(() => {
    logout();
  }, 30 * 60 * 1000); // 30 minutes

  const resetTimeout = () => {
    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      logout();
    }, 30 * 60 * 1000);
  };

  // Reset timeout on user activity
  window.addEventListener('mousemove', resetTimeout);
  window.addEventListener('keypress', resetTimeout);
  window.addEventListener('scroll', resetTimeout);

  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('mousemove', resetTimeout);
    window.removeEventListener('keypress', resetTimeout);
    window.removeEventListener('scroll', resetTimeout);
  };
}, [user]);
```

---

## Update LoginPage to Use AuthContext

```typescript
import { useAuth } from '../context/AuthContext';

export function LoginPage({ onLogin }: LoginPageProps) {
  const { login } = useAuth();

  const handleLogin = (role: string) => {
    const mockUser = {
      id: '1',
      name: role === 'buyer' ? 'John Buyer' : role === 'seller' ? 'Sarah Seller' : 'Legal Expert',
      email: `${role}@cm.com`,
      role: role as any
    };
    
    // Save to context (which saves to localStorage)
    login(mockUser, 'mock-token-' + Date.now());
    
    // Call callback
    onLogin(role as any);
  };

  return (
    // ... your login page JSX
  );
}
```

---

## Test It

1. **Before Implementation**:
   - Login with any role
   - Refresh page → Goes to login page ❌

2. **After Implementation**:
   - Login with any role
   - Refresh page → Stays on dashboard ✅
   - Close browser and reopen → Stays logged in ✅
   - Click logout → Goes to login page ✅

---

## Storage Breakdown

### localStorage (Persistent - Survives browser close)
- `user` - Stored user object
- `authToken` - Authentication token
- `loginTime` - When user logged in

### sessionStorage (Temporary - Cleared on browser close)
- `currentPage` - Which page user was on

---

## Configuration Options

### Change Session Timeout
```typescript
// In AuthContext.tsx - change timeout duration
const TIMEOUT_DURATION = 60 * 60 * 1000; // 1 hour
```

### Disable Session Persistence (For Privacy)
```typescript
// In AuthContext.tsx - comment out localStorage saves
// localStorage.setItem('user', JSON.stringify(newUser));
// localStorage.setItem('authToken', token);
```

### Enable Remember Me Feature
```typescript
// Add to login form
const [rememberMe, setRememberMe] = useState(false);

// In login handler
if (rememberMe) {
  localStorage.setItem('rememberMe', 'true');
} else {
  localStorage.removeItem('rememberMe');
}
```

---

## Troubleshooting

### Problem: Still redirecting to login after refresh
**Solution**: Make sure you wrapped your app with `<AuthProvider>`

### Problem: User data not persisting
**Solution**: Check browser localStorage is not disabled in settings

### Problem: Old user still showing after logout
**Solution**: Clear browser cache and localStorage (Ctrl+Shift+Delete)

---

## Summary

✅ Users stay logged in after refresh
✅ Page state is preserved after refresh
✅ Automatic logout after inactivity (optional)
✅ Session data is secure
✅ Works across browser tabs
✅ Survives browser close (if not using private mode)
