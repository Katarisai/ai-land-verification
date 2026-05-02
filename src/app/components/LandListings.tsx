import { useState, useEffect } from 'react';
import { Shield, LogOut, Bot, MapPin, Search, Filter, ChevronLeft, Star, CheckCircle, AlertCircle, Plus, ShoppingCart, Trash2, Phone, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { User } from '../App';
import { ImageWithFallback } from './lib/ImageWithFallback';

interface LandListingsProps {
  user: User;
  onLogout: () => void;
  onViewLand: (landId: string) => void;
  onBack: () => void;
  onToggleAI: () => void;
  onContactAgent?: (landId: string, landTitle: string) => void;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  addedAt: string;
}

const mockLands = [
  {
    id: '1',
    title: '5.2 Acres Agricultural Land',
    location: 'Fresno County, California',
    price: 125000,
    area: 5.2,
    type: 'Agricultural',
    status: 'verified',
    aiScore: 95,
    riskLevel: 'low',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop'
    ],
    features: ['Water Access', 'Road Frontage', 'Fertile Soil'],
    listedDate: '2 days ago'
  },
  {
    id: '2',
    title: '2.8 Acres Residential Plot',
    location: 'Austin, Texas',
    price: 89500,
    area: 2.8,
    type: 'Residential',
    status: 'in-review',
    aiScore: 88,
    riskLevel: 'low',
    images: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80'
    ],
    features: ['City Utilities', 'Zoned Residential', 'Near Schools'],
    listedDate: '1 week ago'
  },
  {
    id: '3',
    title: '10 Acres Commercial Land',
    location: 'Miami, Florida',
    price: 450000,
    area: 10,
    type: 'Commercial',
    status: 'verified',
    aiScore: 92,
    riskLevel: 'medium',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80'
    ],
    features: ['Highway Access', 'High Traffic', 'Development Ready'],
    listedDate: '3 days ago'
  },
  {
    id: '4',
    title: '15 Acres Forest Land',
    location: 'Oregon Coast',
    price: 210000,
    area: 15,
    type: 'Recreational',
    status: 'verified',
    aiScore: 90,
    riskLevel: 'low',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ],
    features: ['Creek', 'Timber Rights', 'Wildlife'],
    listedDate: '1 day ago'
  },
  {
    id: '5',
    title: '3.5 Acres Mixed Use',
    location: 'Phoenix, Arizona',
    price: 175000,
    area: 3.5,
    type: 'Mixed Use',
    status: 'verified',
    aiScore: 87,
    riskLevel: 'low',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80'
    ],
    features: ['Mountain Views', 'Flat Terrain', 'Solar Potential'],
    listedDate: '5 days ago'
  },
  {
    id: '6',
    title: '8 Acres Industrial Land',
    location: 'Chicago, Illinois',
    price: 320000,
    area: 8,
    type: 'Industrial',
    status: 'in-review',
    aiScore: 85,
    riskLevel: 'medium',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80'
    ],
    features: ['Rail Access', 'Warehouse Zoning', 'Level Ground'],
    listedDate: '4 days ago'
  }
];

export function LandListings({ user, onLogout, onViewLand, onBack, onToggleAI, onContactAgent }: LandListingsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lands, setLands] = useState<any[]>([]);
  const [savedLands, setSavedLands] = useState<string[]>([]);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    area: '',
    type: 'Agricultural',
    features: '',
    image: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE.replace(/\/$/, '') : 'http://localhost:7000';

  // Load lands from backend on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/lands?limit=50`);
        if (!res.ok) throw new Error('Failed to fetch lands');
        const data = await res.json();
        if (!mounted) return;
        // Map backend land objects to UI shape
        const mapped = (data.lands || data).map((l: any) => ({
          id: l.landId || l._id || l.id,
          title: l.property?.description || l.title || `${l.property?.type || ''} - ${l.surveyNumber || ''}`,
          location: `${l.location?.city || ''}${l.location?.state ? ', ' + l.location.state : ''}`,
          price: l.property?.price || 0,
          area: l.property?.area || 0,
          type: l.property?.type || 'Unknown',
          status: l.verification?.overallStatus ? l.verification.overallStatus.toLowerCase() : 'in-review',
          aiScore: Math.round((l.aiProcessing?.riskAssessment?.riskScore || 0.5) * 100),
          riskLevel: (l.aiProcessing?.riskAssessment?.riskLevel || 'medium').toLowerCase(),
          images: (l.imageGallery || []).map((g: any) => g.imageUrl).filter(Boolean),
          features: l.property?.description ? [l.property.description] : (l.features || []),
          listedDate: l.createdDate ? new Date(l.createdDate).toLocaleDateString() : 'Unknown',
          aiSummary: l.aiProcessing?.aiSummary || ''
        }));
        setLands(mapped.length ? mapped : mockLands);
      } catch (err) {
        console.warn('Could not load lands from API, using mock data', err);
        setLands(mockLands);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load saved lands from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedLands');
    if (saved) {
      try {
        setSavedLands(JSON.parse(saved));
      } catch (err) {
        console.warn('Failed to load saved lands from localStorage', err);
      }
    }
  }, []);

  // Save saved lands to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedLands', JSON.stringify(savedLands));
  }, [savedLands]);

  const handleAddToCart = (land: any) => {
    const existingItem = cart.find(item => item.id === land.id);
    if (!existingItem) {
      setCart([...cart, {
        id: land.id,
        title: land.title,
        price: land.price,
        addedAt: new Date().toLocaleTimeString()
      }]);
      alert(`Added "${land.title}" to cart!`);
    } else {
      alert('This property is already in your cart!');
    }
  };

  const handleSaveLand = (landId: string) => {
    if (savedLands.includes(landId)) {
      setSavedLands(savedLands.filter(id => id !== landId));
    } else {
      setSavedLands([...savedLands, landId]);
    }
  };

  const isSaved = (landId: string) => savedLands.includes(landId);

  const handleRemoveFromCart = (landId: string) => {
    setCart(cart.filter(item => item.id !== landId));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Build payload compatible with backend Land model
      const payload: any = {
        surveyNumber: `SURV-${Date.now()}`,
        owner: {
          name: user.name,
          email: user.email,
          phone: '',
          governmentId: '',
          address: ''
        },
        location: {
          city: formData.location,
          state: ''
        },
        property: {
          type: formData.type,
          area: parseFloat(formData.area) || 0,
          areaUnit: 'Acres',
          price: parseFloat(formData.price) || 0,
          currency: 'USD',
          description: ''
        },
        legal: {
          ownershipStatus: 'Individual Owner',
          legalStatus: 'Pending Registration',
          noPendency: false,
          noEncumbrance: false
        },
        documents: [],
        imageGallery: (formData.image ? formData.image.split(',').map((url) => ({ imageUrl: url.trim() })) : [])
      };

      const res = await fetch(`${API_BASE}/api/lands/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Upload failed (${res.status})`);
      }

      const data = await res.json();

      // Add returned land to top of listings (use id = landId for frontend)
      const added = {
        id: data.land.landId || (lands.length + 1).toString(),
        title: formData.title || 'New Listing',
        location: formData.location,
        price: data.land.property?.price || parseFloat(formData.price) || 0,
        area: data.land.property?.area || parseFloat(formData.area) || 0,
        type: data.land.property?.type || formData.type,
        status: data.land.verification?.overallStatus ? data.land.verification.overallStatus.toLowerCase() : 'in-review',
        aiScore: 0,
        riskLevel: data.land.aiProcessing?.riskAssessment?.riskLevel?.toLowerCase() || 'low',
        images: (data.land.imageGallery || []).map((img: any) => img.imageUrl).concat(formData.image ? formData.image.split(',') : []),
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        listedDate: 'Just now',
        aiSummary: data.land.aiProcessing?.aiSummary || ''
      };

      setLands(prev => [added, ...prev]);
      setIsDialogOpen(false);
      setFormData({ title: '', location: '', price: '', area: '', type: 'Agricultural', features: '', image: '' });
      alert('Listing uploaded successfully' + (added.aiSummary ? `\nAI Summary: ${added.aiSummary}` : ''));
    } catch (err: any) {
      console.error('Upload error', err);
      alert('Failed to upload listing: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

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
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onToggleAI}>
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              {user.role === 'buyer' && (
                <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart {cart.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cart.length}</span>}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Shopping Cart ({cart.length} items)</DialogTitle>
                    </DialogHeader>
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-start border-b pb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm text-gray-500">${item.price.toLocaleString()}</p>
                              <p className="text-xs text-gray-400">Added: {item.addedAt}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <div className="pt-4 border-t-2 space-y-3">
                          <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total Value:</span>
                            <span className="text-blue-600">${cart.reduce((total, item) => total + item.price, 0).toLocaleString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                if (cart.length > 0 && onContactAgent) {
                                  onContactAgent(cart[0].id, cart[0].title);
                                  setShowCartDialog(false);
                                }
                              }}
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Proceed to Contact Agent
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Generate Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl">
              {user.role === 'buyer' ? 'Browse Verified Lands' : 'My Land Listings'}
            </h1>
            {user.role !== 'buyer' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Land Listing</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="col-span-3"
                        placeholder="e.g., 5 Acres Agricultural Land"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="col-span-3"
                        placeholder="e.g., Fresno County, California"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price ($)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="col-span-3"
                        placeholder="125000"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="area" className="text-right">
                        Area (acres)
                      </Label>
                      <Input
                        id="area"
                        type="number"
                        step="0.1"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        className="col-span-3"
                        placeholder="5.2"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Agricultural">Agricultural</SelectItem>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Recreational">Recreational</SelectItem>
                          <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="features" className="text-right">
                        Features
                      </Label>
                      <Textarea
                        id="features"
                        value={formData.features}
                        onChange={(e) => handleInputChange('features', e.target.value)}
                        className="col-span-3"
                        placeholder="Water Access, Road Frontage, Fertile Soil (comma separated)"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Images
                      </Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        className="col-span-3"
                        placeholder="Image URL (comma separated for multiple images)"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                      Add Listing
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <p className="text-gray-600">
            {lands.length} verified properties with AI-powered insights
          </p>
          {/* Dev auto-login banner */}
          {typeof window !== 'undefined' && (() => {
            try {
              const saved = localStorage.getItem('user');
              if (saved) {
                const u = JSON.parse(saved);
                if (u?.email === 'dev@example.com') {
                  return (
                    <div className="mt-3 p-2 text-sm bg-yellow-50 border border-yellow-200 text-yellow-700 rounded">
                      Dev auto-login active as <strong>dev@example.com</strong>. To disable: <code>localStorage.setItem('disableDevAutoLogin','true')</code>
                    </div>
                  );
                }
              }
            } catch (e) {}
            return null;
          })()}
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search by location or type..." 
                className="pl-10"
              />
            </div>
          </div>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="agricultural">Agricultural</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-100k">Under $100k</SelectItem>
              <SelectItem value="100k-250k">$100k - $250k</SelectItem>
              <SelectItem value="250k+">$250k+</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => (
            <Card key={land.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <ImageWithFallback
                  src={land.images[0]}
                  alt={land.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant={land.status === 'verified' ? 'default' : 'secondary'}
                    className={land.status === 'verified' ? 'bg-green-600' : 'bg-yellow-600'}
                  >
                    {land.status === 'verified' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {land.status === 'verified' ? 'Verified' : 'In Review'}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-600">
                    AI Score: {land.aiScore}%
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{land.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {land.location}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-0"
                    onClick={() => handleSaveLand(land.id)}
                  >
                    <Star 
                      className={`w-4 h-4 ${isSaved(land.id) ? 'fill-yellow-400 text-yellow-400' : ''}`}
                    />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="outline">{land.type}</Badge>
                  <Badge variant="outline">{land.area} acres</Badge>
                  <Badge 
                    variant="outline"
                    className={land.riskLevel === 'low' ? 'text-green-600 border-green-600' : 'text-orange-600 border-orange-600'}
                  >
                    {land.riskLevel === 'low' ? 'Low Risk' : 'Medium Risk'}
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {land.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${land.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{land.listedDate}</div>
                  </div>
                  <Button onClick={() => onViewLand(land.id)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More Listings
          </Button>
        </div>
      </div>
    </div>
  );
}
