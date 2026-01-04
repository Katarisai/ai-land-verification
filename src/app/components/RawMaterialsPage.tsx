import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Package, Plus, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { User as UserType } from '../App';

interface RawMaterial {
  _id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  minStockLevel: number;
  supplier: string;
  createdAt: string;
  updatedAt: string;
}

interface RawMaterialsPageProps {
  user: UserType;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
}

export function RawMaterialsPage({ user, onLogout, onBack, onToggleAI }: RawMaterialsPageProps) {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    unitPrice: '',
    quantity: '',
    minStockLevel: '',
    supplier: ''
  });

  // Mock suppliers data
  const mockSuppliers = [
    { _id: '1', name: 'ABC Cement Co.' },
    { _id: '2', name: 'SteelWorks Inc.' },
    { _id: '3', name: 'Sand & Gravel Ltd.' }
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockMaterials: RawMaterial[] = [
        {
          _id: '1',
          name: 'Portland Cement',
          description: 'High-quality Portland cement for construction',
          category: 'Cement',
          unit: 'kg',
          unitPrice: 0.15,
          quantity: 5000,
          minStockLevel: 1000,
          supplier: 'ABC Cement Co.',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          _id: '2',
          name: 'Steel Rebars',
          description: 'Reinforcement steel bars for concrete structures',
          category: 'Steel',
          unit: 'kg',
          unitPrice: 0.80,
          quantity: 2000,
          minStockLevel: 500,
          supplier: 'SteelWorks Inc.',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          _id: '3',
          name: 'Sand',
          description: 'Construction sand for concrete mixing',
          category: 'Aggregates',
          unit: 'cubic_meter',
          unitPrice: 25.00,
          quantity: 100,
          minStockLevel: 20,
          supplier: 'Sand & Gravel Ltd.',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          _id: '4',
          name: 'Bricks',
          description: 'Red clay bricks for wall construction',
          category: 'Bricks',
          unit: 'piece',
          unitPrice: 0.50,
          quantity: 500,
          minStockLevel: 200,
          supplier: 'ABC Cement Co.',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ];
      setMaterials(mockMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const materialData = {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        quantity: parseFloat(formData.quantity),
        minStockLevel: parseFloat(formData.minStockLevel)
      };

      if (editingMaterial) {
        // Update existing material
        setMaterials(materials.map(m =>
          m._id === editingMaterial._id
            ? { ...m, ...materialData, updatedAt: new Date().toISOString() } as RawMaterial
            : m
        ));
      } else {
        // Add new material
        const newMaterial: RawMaterial = {
          _id: Date.now().toString(),
          ...materialData as Omit<RawMaterial, '_id' | 'createdAt' | 'updatedAt'>,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setMaterials([...materials, newMaterial]);
      }

      setShowAddDialog(false);
      setEditingMaterial(null);
      resetForm();
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  const handleEdit = (material: RawMaterial) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      description: material.description,
      category: material.category,
      unit: material.unit,
      unitPrice: material.unitPrice.toString(),
      quantity: material.quantity.toString(),
      minStockLevel: material.minStockLevel.toString(),
      supplier: material.supplier
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (materialId: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      try {
        setMaterials(materials.filter(m => m._id !== materialId));
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      unit: '',
      unitPrice: '',
      quantity: '',
      minStockLevel: '',
      supplier: ''
    });
  };

  const getStockStatus = (quantity: number, minStockLevel: number) => {
    if (quantity <= minStockLevel) {
      return { status: 'Low Stock', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    } else if (quantity <= minStockLevel * 1.5) {
      return { status: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800', icon: null };
    } else {
      return { status: 'Good Stock', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading raw materials...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Raw Materials</h1>
            <p className="text-gray-600 mt-2">Manage construction materials and inventory</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingMaterial(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMaterial ? 'Edit Material' : 'Add New Material'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Material Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cement">Cement</SelectItem>
                        <SelectItem value="Steel">Steel</SelectItem>
                        <SelectItem value="Aggregates">Aggregates</SelectItem>
                        <SelectItem value="Bricks">Bricks</SelectItem>
                        <SelectItem value="Wood">Wood</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="cubic_meter">Cubic Meter</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                        <SelectItem value="meter">Meter</SelectItem>
                        <SelectItem value="square_meter">Square Meter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price ($)</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Current Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      min="0"
                      value={formData.minStockLevel}
                      onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select value={formData.supplier} onValueChange={(value) => setFormData({ ...formData, supplier: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSuppliers.map((supplier) => (
                          <SelectItem key={supplier._id} value={supplier.name}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingMaterial ? 'Update' : 'Add'} Material
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => {
            const stockStatus = getStockStatus(material.quantity, material.minStockLevel);
            const StatusIcon = stockStatus.icon;

            return (
              <Card key={material._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <Badge className="mt-1">{material.category}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(material)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(material._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{material.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stock Level:</span>
                      <span className="font-medium">{material.quantity} {material.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Min Level:</span>
                      <span>{material.minStockLevel} {material.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Unit Price:</span>
                      <span>${material.unitPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Value:</span>
                      <span className="font-medium">${(material.quantity * material.unitPrice).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`flex items-center gap-1 ${stockStatus.color}`}>
                      {StatusIcon && <StatusIcon className="w-3 h-3" />}
                      {stockStatus.status}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {material.supplier}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {materials.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No materials found</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Material
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
