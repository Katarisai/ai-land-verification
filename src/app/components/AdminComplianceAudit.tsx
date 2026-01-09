import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AuditLog {
  _id: string;
  admin: { name: string; email: string };
  action: string;
  targetType: string;
  details?: string;
  createdAt: string;
  status: 'success' | 'failed';
}

interface Dispute {
  _id: string;
  userId: { name: string; email: string };
  title: string;
  status: 'open' | 'under-review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

export default function ComplianceAuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'audit' | 'disputes'>('audit');
  const [disputeFilter, setDisputeFilter] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, [disputeFilter]);

  const fetchData = async () => {
    try {
      const [auditRes, disputesRes] = await Promise.all([
        fetch('/api/admin/audit-logs?limit=20'),
        fetch(`/api/admin/disputes${disputeFilter ? `?status=${disputeFilter}` : '?limit=10'}`),
      ]);

      const auditData = await auditRes.json();
      const disputesData = await disputesRes.json();

      setAuditLogs(auditData.logs || []);
      setDisputes(disputesData.disputes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      open: 'bg-yellow-100 text-yellow-800',
      'under-review': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance & Audit</h1>
        <p className="text-gray-600">Monitor audit logs, disputes, and compliance</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'audit' ? 'border-blue-600 text-blue-600' : 'border-transparent'
          }`}
        >
          Audit Logs
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'disputes' ? 'border-blue-600 text-blue-600' : 'border-transparent'
          }`}
        >
          Disputes
        </button>
      </div>

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>All admin activities and system changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log._id} className="border rounded p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.admin?.name}</p>
                      {log.details && <p className="text-xs text-gray-500 mt-1">{log.details}</p>}
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusBadgeColor(log.status)}>{log.status}</Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                className="border rounded px-3 py-2 w-full md:w-64"
                value={disputeFilter}
                onChange={(e) => setDisputeFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="under-review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disputes</CardTitle>
              <CardDescription>User disputes and appeals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disputes.map((dispute) => (
                  <div key={dispute._id} className="border rounded p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{dispute.title}</p>
                        <p className="text-sm text-gray-600">{dispute.userId?.name}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="space-x-2">
                          <Badge className={getStatusBadgeColor(dispute.status)}>
                            {dispute.status}
                          </Badge>
                          <Badge className={getPriorityColor(dispute.priority)}>
                            {dispute.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(dispute.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
