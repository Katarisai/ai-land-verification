import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Clock, User, Building, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { User as UserType } from '../App';

interface Schedule {
  _id: string;
  project: string;
  worker: string;
  date: string;
  startTime: string;
  endTime: string;
  task: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface SchedulePageProps {
  user: UserType;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
}

export function SchedulePage({ user, onLogout, onBack, onToggleAI }: SchedulePageProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    project: '',
    worker: '',
    date: '',
    startTime: '',
    endTime: '',
    task: '',
    status: 'scheduled' as Schedule['status'],
    notes: ''
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
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockSchedules: Schedule[] = [
        {
          _id: '1',
          project: 'Downtown Office Complex',
          worker: 'John Carpenter',
          date: '2024-01-20',
          startTime: '08:00',
          endTime: '16:00',
          task: 'Install wooden frames and doors',
          status: 'scheduled',
          notes: 'Bring safety equipment',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          _id: '2',
          project: 'Residential Tower A',
          worker: 'Mike Electrician',
          date: '2024-01-21',
          startTime: '09:00',
          endTime: '17:00',
          task: 'Wire electrical panels on floor 5',
          status: 'in-progress',
          notes: 'Coordinate with plumbing team',
          createdAt: '2024-01-16',
          updatedAt: '2024-01-16'
        },
        {
          _id: '3',
          project: 'Downtown Office Complex',
          worker: 'Sarah Plumber',
          date: '2024-01-22',
          startTime: '07:00',
          endTime: '15:00',
          task: 'Install plumbing fixtures in bathrooms',
          status: 'completed',
          notes: 'All materials delivered',
          createdAt: '2024-01-17',
          updatedAt: '2024-01-17'
        }
      ];
      setSchedules(mockSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        // Update existing schedule
        setSchedules(schedules.map(s =>
          s._id === editingSchedule._id
            ? { ...s, ...formData, updatedAt: new Date().toISOString() } as Schedule
            : s
        ));
      } else {
        // Add new schedule
        const newSchedule: Schedule = {
          _id: Date.now().toString(),
          ...formData as Omit<Schedule, '_id' | 'createdAt' | 'updatedAt'>,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSchedules([...schedules, newSchedule]);
      }

      setShowAddDialog(false);
      setEditingSchedule(null);
      resetForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      project: schedule.project,
      worker: schedule.worker,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      task: schedule.task,
      status: schedule.status,
      notes: schedule.notes
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        setSchedules(schedules.filter(s => s._id !== scheduleId));
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const updateStatus = async (scheduleId: string, newStatus: Schedule['status']) => {
    try {
      setSchedules(schedules.map(s =>
        s._id === scheduleId
          ? { ...s, status: newStatus, updatedAt: new Date().toISOString() }
          : s
      ));
    } catch (error) {
      console.error('Error updating schedule status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      project: '',
      worker: '',
      date: '',
      startTime: '',
      endTime: '',
      task: '',
      status: 'scheduled',
      notes: ''
    });
  };

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Schedule['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading schedules...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-600 mt-2">Manage work assignments and schedules</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingSchedule(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task">Task Description</Label>
                  <Input
                    id="task"
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    placeholder="Describe the work to be done"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: Schedule['status']) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSchedule ? 'Update' : 'Add'} Schedule
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Schedules List */}
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <Card key={schedule._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{schedule.task}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span>{schedule.project}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{schedule.worker}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(schedule.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`flex items-center gap-1 ${getStatusColor(schedule.status)}`}>
                      {getStatusIcon(schedule.status)}
                      {schedule.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(schedule)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(schedule._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              {schedule.notes && (
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {schedule.notes}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {schedules.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No schedules found</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Schedule
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
