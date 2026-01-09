import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'legal' | 'admin';
  createdAt: string;
  active?: boolean;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [overview, setOverview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [recentAdds, setRecentAdds] = useState<Record<string, any[]>>({});
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [overviewPages, setOverviewPages] = useState<Record<string, number>>({ buyer: 1, seller: 1, legal: 1 });
  const overviewLimit = 5;

  useEffect(() => {
    fetchUsers();
    fetchOverviewAll();
  }, [search, roleFilter, page]);

  useEffect(() => {
    fetchOverviewAll();
  }, [dateStart, dateEnd]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverviewAll = async () => {
    try {
      const qs = new URLSearchParams();
      if (dateStart) qs.append('startDate', dateStart);
      if (dateEnd) qs.append('endDate', dateEnd);
      const response = await fetch(`/api/admin/users/overview?${qs.toString()}`);
      const data = await response.json();
      setOverview(data.rolesSummary || null);
    } catch (error) {
      console.error('Error fetching users overview:', error);
    }
  };

  const fetchOverviewRole = async (role: 'buyer' | 'seller' | 'legal', pageNum: number) => {
    try {
      const qs = new URLSearchParams({ role, page: String(pageNum), limit: String(overviewLimit) });
      if (dateStart) qs.append('startDate', dateStart);
      if (dateEnd) qs.append('endDate', dateEnd);
      const res = await fetch(`/api/admin/users/overview?${qs.toString()}`);
      const data = await res.json();
      setOverview((prev: any) => ({
        ...(prev || {}),
        [role]: data.roleOverview,
      }));
      setOverviewPages((p) => ({ ...p, [role]: pageNum }));
    } catch (error) {
      console.error('Error fetching role overview:', error);
    }
  };

  const toggleExpand = async (userId: string) => {
    const next = !(expanded[userId] || false);
    setExpanded((e) => ({ ...e, [userId]: next }));
    if (next && !recentAdds[userId]) {
      try {
        const qs = new URLSearchParams();
        if (dateStart) qs.append('startDate', dateStart);
        if (dateEnd) qs.append('endDate', dateEnd);
        const res = await fetch(`/api/admin/users/${userId}/recent-adds?${qs.toString()}`);
        const data = await res.json();
        setRecentAdds((m) => ({ ...m, [userId]: data.items || [] }));
      } catch (error) {
        console.error('Error fetching recent adds:', error);
      }
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;

    try {
      await fetch(`/api/admin/users/${userId}/deactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Deactivated by admin' }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      legal: 'bg-blue-100 text-blue-800',
      buyer: 'bg-green-100 text-green-800',
      seller: 'bg-purple-100 text-purple-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-600">Manage users, roles, and permissions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <select
              className="border rounded px-3 py-2"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="legal">Verifier</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Start Date</label>
              <Input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">End Date</label>
              <Input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button variant="secondary" onClick={() => { setDateStart(''); setDateEnd(''); }}>Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview by role with pagination */}
      {overview && (
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {(['buyer', 'seller', 'legal'] as const).map((role) => (
            <div key={role} className="p-4 rounded-lg border bg-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold capitalize">{role === 'legal' ? 'Agents' : role}s</h3>
                <span className="text-sm text-gray-600">{overview[role]?.total || 0} total</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(overview[role]?.users || []).map((u: any) => (
                  <div key={u._id} className="text-sm border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{u.name}</span>
                      <span className="text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-gray-600">{u.email}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Added by: {u.createdBy?.name || '—'}
                      {' • '}Last login: {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '—'}
                      {' • '}Recent adds: {u.addsCount}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                <span>Page {overviewPages[role]} of {overview[role]?.totalPages || 1}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={(overviewPages[role] || 1) <= 1} onClick={() => fetchOverviewRole(role, (overviewPages[role] || 1) - 1)}>Prev</Button>
                  <Button size="sm" variant="outline" disabled={(overviewPages[role] || 1) >= (overview[role]?.totalPages || 1)} onClick={() => fetchOverviewRole(role, (overviewPages[role] || 1) + 1)}>Next</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>Total: {users.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Role</th>
                  <th className="text-left py-2 px-4">Joined</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                        defaultValue={user.role}
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="legal">Verifier</option>
                      </select>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeactivateUser(user._id)}
                      >
                        Deactivate
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleExpand(user._id)}
                      >
                        {expanded[user._id] ? 'Hide' : 'Details'}
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.map((user) => (
                  expanded[user._id] ? (
                    <tr key={user._id + '-details'} className="bg-gray-50">
                      <td colSpan={5} className="py-2 px-4">
                        <div className="text-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">Recent Adds</span>
                            <div className="flex gap-2">
                              <Input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="h-8" />
                              <Input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="h-8" />
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-1 px-2">Type</th>
                                  <th className="text-left py-1 px-2">Action</th>
                                  <th className="text-left py-1 px-2">Resource</th>
                                  <th className="text-left py-1 px-2">When</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(recentAdds[user._id] || []).map((item) => (
                                  <tr key={`${user._id}-${String(item.resourceId || item.createdAt)}`} className="border-b">
                                    <td className="py-1 px-2">{item.actionType}</td>
                                    <td className="py-1 px-2">{item.action}</td>
                                    <td className="py-1 px-2">{item.resource || '—'}</td>
                                    <td className="py-1 px-2">{new Date(item.createdAt).toLocaleString()}</td>
                                  </tr>
                                ))}
                                {(!recentAdds[user._id] || recentAdds[user._id].length === 0) && (
                                  <tr>
                                    <td colSpan={4} className="py-2 px-2 text-gray-500">No recent adds found for the selected range.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
