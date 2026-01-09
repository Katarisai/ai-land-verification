import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrustScoreStats {
  overallStats: {
    avgTrustScore: number;
    minTrustScore: number;
    maxTrustScore: number;
    totalVerifications: number;
  };
  distribution: Array<{ _id: string; count: number }>;
  factorAnalysis: {
    avgDocumentClarity: number;
    avgOwnershipContinuity: number;
    avgLegalCleanliness: number;
    avgEnvironmentalRisk: number;
    avgConstructionFeasibility: number;
  };
}

export default function ReportsAnalyticsPage() {
  const [trustScoreStats, setTrustScoreStats] = useState<TrustScoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const response = await fetch(`/api/admin/reports/trust-score-analytics?${params}`);
      const data = await response.json();
      setTrustScoreStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!trustScoreStats) return <div className="p-6">Error loading analytics</div>;

  const factorData = trustScoreStats.factorAnalysis
    ? [
        { name: 'Document Clarity', value: Math.round(trustScoreStats.factorAnalysis.avgDocumentClarity) },
        { name: 'Ownership', value: Math.round(trustScoreStats.factorAnalysis.avgOwnershipContinuity) },
        { name: 'Legal', value: Math.round(trustScoreStats.factorAnalysis.avgLegalCleanliness) },
        { name: 'Environmental', value: Math.round(trustScoreStats.factorAnalysis.avgEnvironmentalRisk) },
        { name: 'Construction', value: Math.round(trustScoreStats.factorAnalysis.avgConstructionFeasibility) },
      ]
    : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-600">View system performance and analytics</p>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={fetchAnalytics}>Apply Filter</Button>
        </CardContent>
      </Card>

      {/* Trust Score Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(trustScoreStats.overallStats.avgTrustScore)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Min Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trustScoreStats.overallStats.minTrustScore}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Max Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trustScoreStats.overallStats.maxTrustScore}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trustScoreStats.overallStats.totalVerifications}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Trust Score Distribution</CardTitle>
          <CardDescription>Distribution of trust scores across verifications</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={trustScoreStats.distribution.map((item) => ({
                range: item._id,
                count: item.count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Factor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring Factors Analysis</CardTitle>
          <CardDescription>Average contribution of each scoring factor</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={factorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
