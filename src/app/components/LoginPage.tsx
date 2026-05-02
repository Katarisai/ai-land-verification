import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { HardHat, Wrench, Truck, Building, Hammer, Cog } from 'lucide-react';
import { UserRole } from '../App';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  initialRole?: Exclude<UserRole, null>;
  onBackToLanding?: () => void;
}

export function LoginPage({ onLogin, initialRole = 'buyer', onBackToLanding }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'legal' | 'admin'>(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setSelectedRole(initialRole);
  }, [initialRole]);

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
        <div className="absolute bottom-32 left-20 animate-bounce delay-1000">
          <Truck className="w-20 h-20 text-green-600" />
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse delay-500">
          <Building className="w-16 h-16 text-gray-600" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-bounce delay-2000">
          <Hammer className="w-14 h-14 text-red-600" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-pulse delay-1500">
          <Cog className="w-12 h-12 text-purple-600" />
        </div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping delay-2000"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            {onBackToLanding && (
              <div className="flex justify-start mb-2">
                <Button variant="ghost" onClick={onBackToLanding} className="px-0 text-gray-500 hover:text-gray-900">
                  Back to Platform
                </Button>
              </div>
            )}
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
        <div className="progress-bar h-full w-[60%] bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
        </div>
      </div>

      <style>{`
        .delay-500 { animation-delay: 0.5s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1500 { animation-delay: 1.5s; }
        .delay-2000 { animation-delay: 2s; }
        .progress-bar {
          animation: progress 3s ease-in-out infinite;
        }
        @keyframes progress {
          0%, 100% { width: 30%; }
          50% { width: 90%; }
        }
      `}</style>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-white/90 backdrop-blur-sm mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HardHat className="w-6 h-6 text-orange-600" />
                <span className="font-bold">CM Platform</span>
              </div>
              <p className="text-gray-600 text-sm">
                AI-powered global land verification and real estate platform.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Buy Land</li>
                <li>Sell Land</li>
                <li>Legal Services</li>
                <li>Survey Services</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About Us</li>
                <li>How It Works</li>
                <li>Pricing</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
            © 2026 CM Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
