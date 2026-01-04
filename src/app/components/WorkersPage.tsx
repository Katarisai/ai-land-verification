import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Phone, Mail, Plus, Edit, Trash2, Wrench } from 'lucide-react';
import { User as UserType } from '../App';

interface Worker {
  _id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'unavailable';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkersPageProps {
  user: UserType;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
}

export function WorkersPage({ user, onLogout, onBack, onToggleAI }: WorkersPageProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    hourlyRate: '',
    availability: 'available' as Worker['availability']
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockWorkers: Worker[] = [
        {
          _id: '1',
          name: 'John Carpenter',
          email: 'john.carpenter@email.com',
          phone: '+1-555-0101',
          skills: ['Carpentry', 'Woodworking', 'Finishing'],
          experience: 8,
          hourlyRate: 45,
          availability: 'available',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          _id: '2',
          name: 'Mike Electrician',
          email: 'mike.electric@email.com',
          phone: '+1-555-0102',
          skills: ['Electrical', 'Wiring', 'Safety'],
          experience: 12,
          hourlyRate: 55,
          availability: 'busy',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          _id: '3',
          name: 'Sarah Plumber',
          email: 'sarah.plumber@email.com',
          phone: '+1-555-0103',
          skills: ['Plumbing', 'Pipe Fitting', 'Water Systems'],
          experience: 6,
          hourlyRate: 40,
          availability: 'available',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ];
      setWorkers(mockWorkers);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const workerData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        experience: parseInt(formData.experience),
        hourlyRate: parseFloat(formData.hourlyRate)
      };

      if (editingWorker) {
        // Update existing worker
        setWorkers(workers.map(w =>
          w._id === editingWorker._id
            ? { ...w, ...workerData, updatedAt: new Date().toISOString() }
            : w
        ));
      } else {
        // Add new worker
        const newWorker: Worker = {
          _id: Date.now().toString(),
          ...workerData,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setWorkers([...workers, newWorker]);
      }

      setShowAddDialog(false);
      setEditingWorker(null);
      resetForm();
    } catch (error) {
      console.error('Error saving worker:', error);
    }
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      skills: worker.skills.join(', '),
      experience: worker.experience.toString(),
      hourlyRate: worker.hourlyRate.toString(),
      availability: worker.availability
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (workerId: string) => {
    if (confirm('Are you sure you want to delete this worker?')) {
      try {
        setWorkers(workers.filter(w => w._id !== workerId));
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      skills: '',
      experience: '',
      hourlyRate: '',
      availability: 'available'
    });
  };

  const getAvailabilityColor = (availability: Worker['availability']) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading workers...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Workers</h1>
            <p className="text-gray-600 mt-2">Manage your construction workforce</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingWorker(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Worker
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingWorker ? 'Edit Worker' : 'Add New Worker'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g., Carpentry, Electrical, Plumbing"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select value={formData.availability} onValueChange={(value: Worker['availability']) => setFormData({ ...formData, availability: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingWorker ? 'Update' : 'Add'} Worker
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <Card key={worker._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{worker.name}</CardTitle>
                    <Badge className={`mt-1 ${getAvailabilityColor(worker.availability)}`}>
                      {worker.availability}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(worker)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(worker._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{worker.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{worker.phone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Wrench className="w-4 h-4 text-gray-500" />
                    <span>{worker.experience} years experience</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Hourly Rate:</span>
                    <span className="font-medium ml-1">${worker.hourlyRate}/hr</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {worker.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {workers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No workers found</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Worker
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
