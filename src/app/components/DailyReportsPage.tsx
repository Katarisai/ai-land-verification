import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Clock, User, Building, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { User as UserType } from '../App';

interface DailyReport {
  _id: string;
  worker: string;
  project: string;
  date: string;
  workDone: string;
  hoursWorked: number;
  notes: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface DailyReportsPageProps {
  user: UserType;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
}

export function DailyReportsPage({ user, onLogout, onBack, onToggleAI }: DailyReportsPageProps) {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<DailyReport | null>(null);
  const [formData, setFormData] = useState({
    worker: '',
    project: '',
    date: '',
    workDone: '',
    hoursWorked: '',
    notes: '',
    status: 'draft' as DailyReport['status']
  });

  // Mock data for projects and workers
  const mockProjects = [
    { _id: '1', name: 'Downtown Office Complex' },
    { _id: '2', name: 'Residential Tower A' }
  ];

  const mockWorkers = [
    { _id: '1', name: 'John Carpenter' },
    { _id: '2', name: 'Mike Electrician' },
    { _id: '3', name: 'Sarah Plumber' }
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockReports: DailyReport[] = [
        {
          _id: '1',
          worker: 'John Carpenter',
          project: 'Downtown Office Complex',
          date: '2024-01-20',
          workDone: 'Installed wooden frames and doors on floors 1-3. Completed safety inspections.',
          hoursWorked: 8,
          notes: 'Good progress, materials arrived on time',
          status: 'submitted',
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20'
        },
        {
          _id: '2',
          worker: 'Mike Electrician',
          project: 'Residential Tower A',
          date: '2024-01-21',
          workDone: 'Wired electrical panels on floor 5. Installed lighting fixtures in common areas.',
          hoursWorked: 7.5,
          notes: 'Minor delay due to material shortage',
          status: 'approved',
          createdAt: '2024-01-21',
          updatedAt: '2024-01-21'
        },
        {
          _id: '3',
          worker: 'Sarah Plumber',
          project: 'Downtown Office Complex',
          date: '2024-01-22',
          workDone: 'Installed plumbing fixtures in bathrooms on floor 2.',
          hoursWorked: 6,
          notes: 'Completed ahead of schedule',
          status: 'draft',
          createdAt: '2024-01-22',
          updatedAt: '2024-01-22'
        }
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reportData = {
        ...formData,
        hoursWorked: parseFloat(formData.hoursWorked)
      };

      if (editingReport) {
        // Update existing report
        setReports(reports.map(r =>
          r._id === editingReport._id
            ? { ...r, ...reportData, updatedAt: new Date().toISOString() } as DailyReport
            : r
        ));
      } else {
        // Add new report
        const newReport: DailyReport = {
          _id: Date.now().toString(),
          ...reportData as Omit<DailyReport, '_id' | 'createdAt' | 'updatedAt'>,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setReports([...reports, newReport]);
      }

      setShowAddDialog(false);
      setEditingReport(null);
      resetForm();
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const handleEdit = (report: DailyReport) => {
    setEditingReport(report);
    setFormData({
      worker: report.worker,
      project: report.project,
      date: report.date,
      workDone: report.workDone,
      hoursWorked: report.hoursWorked.toString(),
      notes: report.notes,
      status: report.status
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        setReports(reports.filter(r => r._id !== reportId));
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const updateStatus = async (reportId: string, newStatus: DailyReport['status']) => {
    try {
      setReports(reports.map(r =>
        r._id === reportId
          ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
          : r
      ));
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      worker: '',
      project: '',
      date: '',
      workDone: '',
      hoursWorked: '',
      notes: '',
      status: 'draft'
    });
  };

  const getStatusColor = (status: DailyReport['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading daily reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onBack} className="mr-2">
                ← Back
              </Button>
              <span className="text-xl font-bold">Construction Manager</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <div>{user.name}</div>
                <div className="text-gray-500 text-xs capitalize">{user.role}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daily Reports</h1>
            <p className="text-gray-600 mt-2">Track daily work progress and productivity</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingReport(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingReport ? 'Edit Report' : 'Add Daily Report'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="worker">Worker</Label>
                    <Select value={formData.worker} onValueChange={(value) => setFormData({ ...formData, worker: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select worker" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockWorkers.map((worker) => (
                          <SelectItem key={worker._id} value={worker.name}>
                            {worker.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project">Project</Label>
                    <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProjects.map((project) => (
                          <SelectItem key={project._id} value={project.name}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hoursWorked">Hours Worked</Label>
                    <Input
                      id="hoursWorked"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.hoursWorked}
                      onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workDone">Work Done</Label>
                  <Textarea
                    id="workDone"
                    value={formData.workDone}
                    onChange={(e) => setFormData({ ...formData, workDone: e.target.value })}
                    placeholder="Describe the work completed today"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes or observations"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: DailyReport['status']) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingReport ? 'Update' : 'Add'} Report
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{report.worker}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>{report.project}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{report.hoursWorked} hours</span>
                      </div>
                    </div>
                    <Badge className={`mb-2 ${getStatusColor(report.status)}`}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(report)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(report._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1">Work Done</h4>
                  <p className="text-sm text-gray-600">{report.workDone}</p>
                </div>
                {report.notes && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">Notes</h4>
                    <p className="text-sm text-gray-600">{report.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No daily reports found</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
