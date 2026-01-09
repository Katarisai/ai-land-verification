import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Verification {
  _id: string;
  userId: { name: string; email: string };
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  trustScore?: number;
  confidence?: string;
  createdAt: string;
  assignedVerifier?: { name: string };
}

export default function VerificationManagementPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, [statusFilter, page]);

  const fetchVerifications = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/verifications?${params}`);
      const data = await response.json();
      setVerifications(data.verifications);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTrustScoreColor = (score?: number) => {
    if (!score) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Verification Management</h1>
        <p className="text-gray-600">Monitor and manage land verifications</p>
      </div>

      {/* Status Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            className="border rounded px-3 py-2 w-full md:w-64"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </CardContent>
      </Card>

      {/* Verifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Verifications</CardTitle>
          <CardDescription>Total: {verifications.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">User</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Trust Score</th>
                  <th className="text-left py-2 px-4">Confidence</th>
                  <th className="text-left py-2 px-4">Verifier</th>
                  <th className="text-left py-2 px-4">Date</th>
                  <th className="text-left py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v) => (
                  <tr key={v._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{v.userId.name}</p>
                        <p className="text-xs text-gray-600">{v.userId.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusBadgeColor(v.status)}>{v.status}</Badge>
                    </td>
                    <td className={`py-3 px-4 font-bold ${getTrustScoreColor(v.trustScore)}`}>
                      {v.trustScore ?? '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{v.confidence || '-'}</Badge>
                    </td>
                    <td className="py-3 px-4">{v.assignedVerifier?.name || 'Unassigned'}</td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVerification(v)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
