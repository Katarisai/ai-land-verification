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
