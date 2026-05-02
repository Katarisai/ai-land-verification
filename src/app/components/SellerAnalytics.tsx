import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, DollarSign, Eye, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User } from '../App';

interface SellerAnalyticsProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
}

export function SellerAnalytics({ user, onLogout, onBack, onToggleAI }: SellerAnalyticsProps) {
  const [period, setPeriod] = useState<'current' | 'last-month' | 'last-three-months' | 'year'>('current');
  const [chartType, setChartType] = useState<'revenue' | 'listings' | 'inquiries'>('revenue');

  // Mock Analytics Data
  const [analyticsData] = useState({
    dashboard: {
      totalListings: 42,
      activeListings: 28,
      soldListings: 14,
      totalRevenue: 185420,
      rating: 4.8,
      responseRate: 95,
    },
    daily: [
      { date: '2024-01-01', revenue: 2450, inquiries: 12, listings: 3, views: 156 },
      { date: '2024-01-02', revenue: 3120, inquiries: 15, listings: 2, views: 189 },
      { date: '2024-01-03', revenue: 2890, inquiries: 10, listings: 4, views: 142 },
      { date: '2024-01-04', revenue: 4200, inquiries: 18, listings: 5, views: 234 },
      { date: '2024-01-05', revenue: 3456, inquiries: 14, listings: 2, views: 178 },
      { date: '2024-01-06', revenue: 2890, inquiries: 11, listings: 3, views: 165 },
      { date: '2024-01-07', revenue: 5100, inquiries: 20, listings: 6, views: 289 },
    ],
    monthlyRevenue: [
      { month: 'Jan', actual: 18540, target: 20000, commission: 1854 },
      { month: 'Feb', actual: 22350, target: 20000, commission: 2235 },
      { month: 'Mar', actual: 19800, target: 20000, commission: 1980 },
      { month: 'Apr', actual: 25600, target: 20000, commission: 2560 },
      { month: 'May', actual: 28900, target: 20000, commission: 2890 },
      { month: 'Jun', actual: 31200, target: 20000, commission: 3120 },
    ],
    inquiryMetrics: {
      totalInquiries: 156,
      newInquiries: 23,
      respondedInquiries: 148,
      qualifiedLeads: 67,
      conversionRate: 43,
      averageResponseTime: 2.5, // hours
    },
    listingPerformance: [
      { title: '5.2 Acres Agricultural Land', views: 456, inquiries: 23, daysActive: 45, status: 'active', revenue: 12500 },
      { title: '2.8 Acres Residential Plot', views: 389, inquiries: 18, daysActive: 32, status: 'active', revenue: 9800 },
      { title: '10 Acres Commercial Land', views: 567, inquiries: 31, daysActive: 28, status: 'active', revenue: 28900 },
      { title: '15 Acres Forest Land', views: 234, inquiries: 12, daysActive: 22, status: 'sold', revenue: 42100 },
      { title: '3.5 Acres Mixed Use', views: 345, inquiries: 15, daysActive: 18, status: 'active', revenue: 18000 },
    ],
  });

  // Revenue trend calculation
  const revenueTrend = useMemo(() => {
    const current = analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 1]?.actual || 0;
    const previous = analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 2]?.actual || 0;
    return { current, previous, trend: current > previous ? 'up' : 'down', percent: ((current - previous) / previous * 100).toFixed(1) };
  }, []);

  const inquiryTrend = analyticsData.inquiryMetrics.newInquiries > 20 ? 'up' : 'down';
  const listingTrend = analyticsData.dashboard.activeListings > 25 ? 'up' : 'down';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="current">Current Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-three-months">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
              <Button variant="outline" size="sm" onClick={onToggleAI}>Ask AI</Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    ${(analyticsData.dashboard.totalRevenue / 1000).toFixed(1)}K
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {revenueTrend.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={revenueTrend.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {revenueTrend.percent}% vs last month
                    </span>
                  </div>
                </div>
                <DollarSign className="w-12 h-12 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Listings</p>
                  <div className="text-3xl font-bold text-green-600 mt-2">
                    {analyticsData.dashboard.activeListings}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {listingTrend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={listingTrend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {listingTrend === 'up' ? '+3' : '-2'} this month
                    </span>
                  </div>
                </div>
                <BarChart3 className="w-12 h-12 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">New Inquiries</p>
                  <div className="text-3xl font-bold text-orange-600 mt-2">
                    {analyticsData.inquiryMetrics.newInquiries}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {inquiryTrend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={inquiryTrend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {inquiryTrend === 'up' ? '+5' : '-2'} vs last week
                    </span>
                  </div>
                </div>
                <MessageSquare className="w-12 h-12 text-orange-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Conversion Rate</p>
                  <div className="text-3xl font-bold text-purple-600 mt-2">
                    {analyticsData.inquiryMetrics.conversionRate}%
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {analyticsData.inquiryMetrics.qualifiedLeads}/{analyticsData.inquiryMetrics.totalInquiries} inquiries qualified
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-purple-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                {analyticsData.monthlyRevenue.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      style={{ height: `${(data.actual / 35000) * 100}%` }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                    <p className="text-xs font-medium">${(data.actual / 1000).toFixed(0)}K</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'New', value: 8, color: 'bg-blue-500', percent: 5 },
                  { label: 'Contacted', value: 67, color: 'bg-yellow-500', percent: 43 },
                  { label: 'Qualified', value: 56, color: 'bg-green-500', percent: 36 },
                  { label: 'Negotiating', value: 15, color: 'bg-orange-500', percent: 10 },
                  { label: 'Won', value: 10, color: 'bg-green-600', percent: 6 },
                ].map((status) => (
                  <div key={status.label}>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium">{status.label}</p>
                      <p className="text-sm text-gray-600">{status.value}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${status.color}`}
                        style={{ width: `${status.percent * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listing Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Listing</th>
                    <th className="text-center py-3 px-4 font-medium">Views</th>
                    <th className="text-center py-3 px-4 font-medium">Inquiries</th>
                    <th className="text-center py-3 px-4 font-medium">Revenue</th>
                    <th className="text-center py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.listingPerformance.map((listing) => (
                    <tr key={listing.title} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-xs text-gray-600">{listing.daysActive} days active</p>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="w-4 h-4 text-blue-600" />
                          {listing.views}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <MessageSquare className="w-4 h-4 text-orange-600" />
                          {listing.inquiries}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 font-medium">
                        ${(listing.revenue / 1000).toFixed(1)}K
                      </td>
                      <td className="text-center py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            listing.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {listing.status === 'active' ? 'Active' : 'Sold'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {analyticsData.inquiryMetrics.averageResponseTime}h
                </div>
                <p className="text-gray-600 text-sm mt-2">Average Response Time</p>
                <p className="text-xs text-gray-500 mt-1">Response rate: {analyticsData.inquiryMetrics.responseRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600">
                  {analyticsData.inquiryMetrics.totalInquiries}
                </div>
                <p className="text-gray-600 text-sm mt-2">Total Received</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ {analyticsData.inquiryMetrics.newInquiries} new this month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qualified Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {analyticsData.inquiryMetrics.qualifiedLeads}
                </div>
                <p className="text-gray-600 text-sm mt-2">Ready for Proposal</p>
                <p className="text-xs text-gray-500 mt-1">
                  {analyticsData.inquiryMetrics.conversionRate}% conversion rate
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
