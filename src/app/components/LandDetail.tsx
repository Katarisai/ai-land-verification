import { useState } from 'react';
import { Shield, LogOut, Bot, MapPin, Search, Filter, ChevronLeft, Star, CheckCircle, AlertCircle, Edit, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { User } from '../App';
import { ImageWithFallback } from './lib/ImageWithFallback';

interface LandDetailProps {
  user: User;
  landId: string;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
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
    image: 'farmland aerial',
    features: ['Water Access', 'Road Frontage', 'Fertile Soil'],
    listedDate: '2 days ago',
    description: 'Prime agricultural land with excellent soil quality and irrigation access. Perfect for farming operations with high yield potential.'
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
    image: 'residential land',
    features: ['City Utilities', 'Zoned Residential', 'Near Schools'],
    listedDate: '1 week ago',
    description: 'Beautiful residential plot in a growing neighborhood with all utilities available. Ideal for building your dream home.'
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
    image: 'commercial property',
    features: ['Highway Access', 'High Traffic', 'Development Ready'],
    listedDate: '3 days ago',
    description: 'Strategic commercial location with excellent visibility and traffic flow. Perfect for retail or office development.'
  }
];

export function LandDetail({ user, landId, onLogout, onBack, onToggleAI }: LandDetailProps) {
  const land = mockLands.find(l => l.id === landId);
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [editedLand, setEditedLand] = useState({
    title: '',
    price: 0,
    description: '',
    location: ''
  });

  if (!land) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Land Not Found</h2>
          <Button onClick={onBack}>Back to Listings</Button>
        </div>
      </div>
    );
  }

  // Handler functions
  const handleEditListing = () => {
    setEditedLand({
      title: land.title,
      price: land.price,
      description: land.description,
      location: land.location
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedLand({ title: '', price: 0, description: '', location: '' });
  };

  const handleSaveEdit = () => {
    // In a real app, this would make an API call to save the changes
    console.log('Saving edited land:', editedLand);
    // Mock success - in real app, show success message
    alert('Listing updated successfully!');
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadDocuments = () => {
    // In a real app, this would upload files to server
    console.log('Uploading files:', uploadedFiles);
    // Mock success - in real app, show success message
    alert(`Successfully uploaded ${uploadedFiles.length} document(s)!`);
    setShowUploadDialog(false);
    setUploadedFiles([]);
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
                Back to Listings
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onToggleAI}>
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={land.image}
                alt={land.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {user.role !== 'buyer' && (
                <>
                  <Button onClick={handleEditListing} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Listing
                  </Button>
                  <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Documents</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.jpg,.png"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Supported formats: PDF, DOC, DOCX, JPG, PNG
                          </p>
                        </div>
                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Files to upload:</h4>
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeUploadedFile(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUploadDocuments} disabled={uploadedFiles.length === 0}>
                            Upload {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{isEditing ? 'Edit Listing' : land.title}</span>
                  <Badge className="bg-blue-600">
                    AI Score: {land.aiScore}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        value={editedLand.title}
                        onChange={(e) => setEditedLand(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <Input
                        value={editedLand.location}
                        onChange={(e) => setEditedLand(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price ($)</label>
                      <Input
                        type="number"
                        value={editedLand.price}
                        onChange={(e) => setEditedLand(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={editedLand.description}
                        onChange={(e) => setEditedLand(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit}>Save Changes</Button>
                      <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {land.location}
                    </div>

                    <div className="text-3xl font-bold text-blue-600">
                      ${land.price.toLocaleString()}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Area</div>
                        <div className="font-semibold">{land.area} acres</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Type</div>
                        <div className="font-semibold">{land.type}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Risk Level</div>
                        <Badge
                          variant="outline"
                          className={land.riskLevel === 'low' ? 'text-green-600 border-green-600' : 'text-orange-600 border-orange-600'}
                        >
                          {land.riskLevel === 'low' ? 'Low Risk' : 'Medium Risk'}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Listed</div>
                        <div className="font-semibold">{land.listedDate}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-600">{land.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {land.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
