import { Shield, LogOut, Bot, MapPin, FileText, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { User } from '../App';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: 'dashboard' | 'listings') => void;
  onToggleAI: () => void;
}

export function Dashboard({ user, onLogout, onNavigate, onToggleAI }: DashboardProps) {
  const isBuyer = user.role === 'buyer';
  const isSeller = user.role === 'seller';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold">CM Platform</span>
              </div>
              <div className="hidden md:flex gap-4">
                <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('listings')}>
                  {isBuyer ? 'Browse Lands' : 'My Listings'}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onToggleAI}>
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <div className="text-sm">
                <div>{user.name}</div>
                <div className="text-gray-500 text-xs capitalize">{user.role}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            {isBuyer && "Explore verified land listings with AI-powered insights"}
            {isSeller && "Manage your land listings and track verification status"}
            {user.role === 'legal' && "Review pending verifications and legal documentation"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {isBuyer ? 'Saved Listings' : 'Active Listings'}
                  </p>
                  <p className="text-2xl">{isBuyer ? '12' : '5'}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {isBuyer ? 'Documents Viewed' : 'Verified Docs'}
                  </p>
                  <p className="text-2xl">{isBuyer ? '28' : '15'}</p>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">AI Reports</p>
                  <p className="text-2xl">{isBuyer ? '8' : '12'}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {isBuyer ? 'Inquiries Sent' : 'Inquiries Received'}
                  </p>
                  <p className="text-2xl">{isBuyer ? '6' : '18'}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isBuyer ? 'Recently Viewed Lands' : 'Recent Listing Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: '5.2 Acres Agricultural Land, California',
                      location: 'Fresno County, CA',
                      status: 'Verified',
                      statusColor: 'green',
                      price: '$125,000',
                      date: '2 hours ago'
                    },
                    {
                      title: '2.8 Acres Residential Plot, Texas',
                      location: 'Austin, TX',
                      status: 'In Review',
                      statusColor: 'yellow',
                      price: '$89,500',
                      date: '1 day ago'
                    },
                    {
                      title: '10 Acres Commercial Land, Florida',
                      location: 'Miami, FL',
                      status: 'Verified',
                      statusColor: 'green',
                      price: '$450,000',
                      date: '3 days ago'
                    }
                  ].map((land, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{land.title}</h3>
                          <Badge variant={land.statusColor === 'green' ? 'default' : 'secondary'}>
                            {land.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{land.location}</p>
                        <p className="text-sm text-gray-500">{land.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">{land.price}</p>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onNavigate('listings')}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Market Opportunity Detected</h4>
                        <p className="text-sm text-gray-700">
                          {isBuyer 
                            ? 'New verified agricultural lands in your preferred areas have 15% below market pricing.'
                            : 'Your listing in Austin is in a high-demand area. Consider competitive pricing.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Documentation Tip</h4>
                        <p className="text-sm text-gray-700">
                          {isBuyer
                            ? '3 of your saved listings have complete AI-verified documentation ready for review.'
                            : 'Upload additional soil test reports to increase buyer confidence by 40%.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => onNavigate('listings')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {isBuyer ? 'Browse All Lands' : 'Add New Listing'}
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={onToggleAI}>
                  <Bot className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
              </CardContent>
            </Card>

            {/* Verification Progress (for Sellers) */}
            {isSeller && (
              <Card>
                <CardHeader>
                  <CardTitle>Verification Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Documents Uploaded</span>
                      <span>5/5</span>
                    </div>
                    <Progress value={100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>AI Analysis</span>
                      <span>Complete</span>
                    </div>
                    <Progress value={100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Legal Review</span>
                      <span>In Progress</span>
                    </div>
                    <Progress value={65} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Survey Verification</span>
                      <span>Pending</span>
                    </div>
                    <Progress value={30} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">AI verification complete</p>
                    <p className="text-gray-600 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">New document uploaded</p>
                    <p className="text-gray-600 text-xs">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Action required</p>
                    <p className="text-gray-600 text-xs">2 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
