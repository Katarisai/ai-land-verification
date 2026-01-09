import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { HardHat, Wrench, Truck, Building, Hammer, Cog } from 'lucide-react';
import { UserRole } from '../App';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'legal' | 'admin'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password length
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    setPasswordError('');
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // Mock login - in real app, this would validate credentials
      onLogin(selectedRole); // Use selected role for login
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-200">
      {/* Construction Background Animation */}
      <div className="absolute inset-0 opacity-10">
        {/* Animated construction elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <HardHat className="w-16 h-16 text-orange-600" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse">
          <Wrench className="w-12 h-12 text-blue-600" />
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce" style={{ animationDelay: '1s' }}>
          <Truck className="w-20 h-20 text-green-600" />
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Building className="w-16 h-16 text-gray-600" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-bounce" style={{ animationDelay: '2s' }}>
          <Hammer className="w-14 h-14 text-red-600" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Cog className="w-12 h-12 text-purple-600" />
        </div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                <HardHat className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Construction Manager
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Sign in to manage your construction projects
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password (min 8 characters)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.length < 8) {
                      setPasswordError('Password must be at least 8 characters');
                    } else {
                      setPasswordError('');
                    }
                  }}
                  required
                  minLength={8}
                  className={`transition-all duration-200 focus:ring-2 focus:ring-orange-500 ${
                    passwordError ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'buyer' | 'seller' | 'legal' | 'admin')}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-orange-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Demo: any email & password (min 8 chars)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Construction Progress Bar Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse"
             style={{
               width: '60%',
               animation: 'progress 3s ease-in-out infinite'
             }}>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0%, 100% { width: 30%; }
          50% { width: 90%; }
        }
      `}</style>
    </div>
  );
}
