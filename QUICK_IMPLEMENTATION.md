# Quick Implementation Guide - Session Persistence

## 📋 Summary
- **Problem**: Page refreshes redirect to login
- **Solution**: Use AuthContext with localStorage to persist sessions
- **Files Created**: 
  1. `src/app/context/AuthContext.tsx` ✅ (Ready)
  2. `SESSION_PERSISTENCE_GUIDE.md` ✅ (Full details)

---

## ⚡ Quick 3-Step Implementation

### Step 1: Update App.tsx (Add AuthProvider)

**Current Code**:
```tsx
export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | ...>('login');
  const [user, setUser] = useState<User | null>(null);
  // ... rest of code
}
```

**New Code**:
```tsx
import { AuthProvider, useAuth } from './context/AuthContext';

// Wrap your entire app with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Move all your current App logic here
function AppContent() {
  const { user, login, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | ...>('login');
  
  // Show loading screen while restoring session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4">Restoring session...</p>
      </div>
    );
  }

  // Redirect non-logged-in users to login page
  if (!user) {
    return <LoginPage onLogin={(role) => {
      login({
        id: '1',
        name: role === 'buyer' ? 'John Buyer' : 'Sarah Seller',
        email: `${role}@cm.com`,
        role: role as any
      }, 'token-' + Date.now());
    }} />;
  }

  const handleLogout = () => {
    logout();
  };

  // ... rest of your page rendering
}
```

---

### Step 2: Update LoginPage.tsx (Use login from context)

**Before**:
```tsx
export function LoginPage({ onLogin }: LoginPageProps) {
  const handleLoginClick = (role: string) => {
    onLogin(role as UserRole);
  };
  // ... rest
}
```

**After**:
```tsx
import { useAuth } from '../context/AuthContext';

export function LoginPage({ onLogin }: LoginPageProps) {
  const { login } = useAuth();
  
  const handleLoginClick = (role: string) => {
    const mockUser = {
      id: '1',
      name: role === 'buyer' ? 'John Buyer' : 'Sarah Seller',
      email: `${role}@cm.com`,
      role: role as any
    };
    
    login(mockUser, 'mock-token-' + Date.now());
    onLogin(role as UserRole);
  };
  
  // ... rest stays same
}
```

---

### Step 3: Test It

```
✅ Before: Login → Refresh → Goes to login page ❌
✅ After: Login → Refresh → Stays on dashboard ✅
```

---

## 📊 What Gets Saved/Restored

### Saved to Browser (localStorage)
```json
{
  "user": {
    "id": "1",
    "name": "John Buyer",
    "email": "buyer@cm.com",
    "role": "buyer"
  },
  "authToken": "mock-token-1736156400000",
  "loginTime": "2026-01-06T10:00:00.000Z"
}
```

### Saved to Session (sessionStorage)
```json
{
  "currentPage": "dashboard"
}
```

---

## 🎯 Features

| Feature | Status | How It Works |
|---------|--------|-------------|
| **Persist Login** | ✅ Enabled | Saves user to localStorage on login |
| **Restore Session on Refresh** | ✅ Enabled | Reads from localStorage on app load |
| **Restore Previous Page** | ⏳ Optional | Can add sessionStorage to remember page |
| **Session Timeout** | ⏳ Optional | 30min inactivity (currently disabled, uncomment to enable) |
| **Remember Me** | ⏳ Optional | Can extend localStorage expiry |

---

## 🔒 What's Secure

✅ Token stored in localStorage (accessible only from same domain)
✅ User data doesn't contain password
✅ Clear logout removes all data
✅ Can add HTTPS-only cookies for extra security
✅ SessionStorage cleared on browser close

---

## 🚀 Optional Enhancements

### Enable Session Timeout
In `AuthContext.tsx`, uncomment these lines:
```tsx
// Uncomment to enable 30-min inactivity timeout
window.addEventListener('mousemove', resetTimeout);
window.addEventListener('keypress', resetTimeout);
window.addEventListener('scroll', resetTimeout);
```

### Save Current Page
In `App.tsx`, add:
```tsx
useEffect(() => {
  sessionStorage.setItem('currentPage', currentPage);
}, [currentPage]);
```

### Add Remember Me Feature
In `LoginPage.tsx`, add checkbox and save preference:
```tsx
localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
```

---

## ❌ Common Issues & Fixes

### Issue: Still redirecting to login
**Fix**: Make sure App is wrapped with `<AuthProvider>`

### Issue: User not persisting
**Fix**: Check browser localStorage is enabled (not in private mode)

### Issue: Old user still showing after logout
**Fix**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Or call `localStorage.clear()` in console

### Issue: Different user on refresh
**Fix**: Make sure `login()` saves to localStorage

---

## 📁 Files to Modify

1. **✅ DONE**: `src/app/context/AuthContext.tsx` - Created
2. **TODO**: `src/app/App.tsx` - Wrap with AuthProvider
3. **TODO**: `src/app/components/LoginPage.tsx` - Use login from context

---

## 💡 How It Works (Under the Hood)

```
User Opens App
    ↓
AuthProvider checks localStorage
    ├─ If user found → Restore session ✅
    └─ If not found → Show login page
        ↓
    User clicks Login
        ↓
    login() function saves to localStorage
        ↓
    On refresh → Finds saved data → Restores session
        ↓
    User stays logged in ✅
```

---

## ✨ Result After Implementation

```
BEFORE:
Login with admin → Page shows admin dashboard → Refresh → REDIRECT TO LOGIN ❌

AFTER:
Login with admin → Page shows admin dashboard → Refresh → SAME PAGE, STILL LOGGED IN ✅
```

---

## Next Steps

1. Copy the code from steps 1-3 above
2. Update your App.tsx and LoginPage.tsx
3. Test by logging in and refreshing
4. Enjoy persistent sessions! 🎉

For more details, see: `SESSION_PERSISTENCE_GUIDE.md`
