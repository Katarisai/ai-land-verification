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
  authToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Restore user session from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setAuthToken(savedToken);
        console.log('User session restored:', parsedUser.email);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginTime');
      }
    }
    // In development, auto-login is opt-in so localhost opens on the pre-login flow by default.
    // Enable it manually with localStorage.setItem('enableDevAutoLogin','true') if needed.
    try {
      // @ts-ignore - import.meta exists in Vite env
      const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
      const enableDevAutoLogin = localStorage.getItem('enableDevAutoLogin') === 'true';
      if (!savedUser && !savedToken && isDev && enableDevAutoLogin) {
        const mockUser: User = {
          id: 'dev-user-1',
          name: 'Dev User',
          email: 'dev@example.com',
          role: 'seller'
        };
        const mockToken = 'dev-mock-token-' + Date.now();
        setUser(mockUser);
        setAuthToken(mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('loginTime', new Date().toISOString());
        console.log('Dev auto-login applied for local development');
      }
    } catch (err) {
      // ignore if import.meta not available in some environments
    }
    setIsLoading(false);
  }, []);

  // Setup session timeout (optional - uncomment to enable)
  useEffect(() => {
    if (!user) return;

    // Set new timeout
    const id = setTimeout(() => {
      console.log('Session expired due to inactivity');
      logout();
    }, SESSION_TIMEOUT);

    setTimeoutId(id);

    return () => {
      if (id) clearTimeout(id);
    };
  }, [user]);

  const login = (newUser: User, token: string) => {
    setUser(newUser);
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('authToken', token);
    localStorage.setItem('loginTime', new Date().toISOString());
    console.log('User logged in:', newUser.email);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginTime');
    sessionStorage.removeItem('currentPage');
    sessionStorage.removeItem('selectedLandId');
    if (timeoutId) clearTimeout(timeoutId);
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, authToken }}>
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
