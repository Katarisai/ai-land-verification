import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Briefcase, DollarSign, Shield, Save, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User as UserType } from '../App';

interface SellerProfileProps {
  user: UserType;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
}

export function SellerProfile({ user, onLogout, onBack, onToggleAI }: SellerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'bank' | 'verification' | 'preferences'>('basic');
  const [showPassword, setShowPassword] = useState(false);

  // Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    companyName: 'Your Company',
    businessType: 'Broker',
    phoneNumber: '+1-555-0101',
    alternatePhone: '+1-555-0102',
    yearsInBusiness: 5,
    bio: 'Professional land broker with 5+ years of experience in agricultural and residential properties.',
    profileImage: '',
    specialization: ['Agricultural', 'Residential'],
  });

  // Bank Details State
  const [bankDetails, setBankDetails] = useState({
    accountHolder: 'John Doe',
    accountNumber: '****3456',
    bankName: 'First National Bank',
    accountType: 'checking',
    isVerified: true,
  });

  // Verification Status State
  const [verification, setVerification] = useState({
    identityProof: { verified: true, verificationDate: '2024-01-15' },
    addressProof: { verified: true, verificationDate: '2024-01-15' },
    businessLicenseDoc: { verified: false, verificationDate: null },
    taxIdDoc: { verified: false, verificationDate: null },
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    weeklyReports: true,
    marketingEmails: false,
  });

  // KPI Stats
  const [kpis] = useState({
    totalListings: 42,
    activeListings: 28,
    soldListings: 14,
    totalRevenue: '$185,420',
    rating: 4.8,
    responseRate: 95,
    totalInquiries: 156,
    conversionRate: 32,
  });

  // Badges
  const [badges] = useState(['verified', 'top-seller', 'responsive']);

  const handleBasicInfoChange = (field: string, value: any) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankDetailsChange = (field: string, value: any) => {
    setBankDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save to backend API
    console.log('Saving profile:', { basicInfo, bankDetails, preferences });
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleUploadDocument = (docType: string) => {
    // Handle file upload
    console.log(`Uploading ${docType}`);
    alert(`Document upload started for ${docType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
              <h1 className="text-2xl font-bold">Seller Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onToggleAI}>Ask AI</Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-white p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Briefcase className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{basicInfo.companyName}</h2>
                <p className="text-blue-100 mt-1">{basicInfo.businessType}</p>
                <div className="flex gap-2 mt-3">
                  {badges.map((badge) => (
                    <Badge key={badge} className="bg-white/20 text-white capitalize">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-blue-600 hover:bg-gray-100'}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{kpis.totalListings}</div>
                <p className="text-gray-600 text-sm mt-1">Total Listings</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{kpis.activeListings}</div>
                <p className="text-gray-600 text-sm mt-1">Active Listings</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">${(parseInt(kpis.totalRevenue.replace(/[^0-9]/g, '')) / 1000).toFixed(0)}K</div>
                <p className="text-gray-600 text-sm mt-1">Total Revenue</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-bold text-yellow-600">{kpis.rating}</span>
                  <span className="text-yellow-600">★</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Average Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {(['basic', 'bank', 'verification', 'preferences'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'basic' && 'Basic Info'}
              {tab === 'bank' && 'Banking'}
              {tab === 'verification' && 'Verification'}
              {tab === 'preferences' && 'Preferences'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {/* BASIC INFO TAB */}
          {activeTab === 'basic' && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <Input
                      disabled={!isEditing}
                      value={basicInfo.companyName}
                      onChange={(e) => handleBasicInfoChange('companyName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Business Type</label>
                    <select
                      disabled={!isEditing}
                      value={basicInfo.businessType}
                      onChange={(e) => handleBasicInfoChange('businessType', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                    >
                      <option>Broker</option>
                      <option>Developer</option>
                      <option>Landowner</option>
                      <option>Agent</option>
                      <option>Company</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      disabled={!isEditing}
                      value={basicInfo.phoneNumber}
                      onChange={(e) => handleBasicInfoChange('phoneNumber', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Years in Business</label>
                    <Input
                      disabled={!isEditing}
                      type="number"
                      value={basicInfo.yearsInBusiness}
                      onChange={(e) => handleBasicInfoChange('yearsInBusiness', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <Textarea
                    disabled={!isEditing}
                    value={basicInfo.bio}
                    onChange={(e) => handleBasicInfoChange('bio', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Specialization</label>
                  <div className="flex flex-wrap gap-2">
                    {['Agricultural', 'Residential', 'Commercial', 'Industrial'].map((spec) => (
                      <Badge
                        key={spec}
                        variant={basicInfo.specialization.includes(spec) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          if (!isEditing) return;
                          setBasicInfo((prev) => ({
                            ...prev,
                            specialization: prev.specialization.includes(spec)
                              ? prev.specialization.filter((s) => s !== spec)
                              : [...prev.specialization, spec],
                          }));
                        }}
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* BANKING TAB */}
          {activeTab === 'bank' && (
            <Card>
              <CardHeader>
                <CardTitle>Banking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Bank details are encrypted and securely stored. Your account must be verified before processing withdrawals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                    <Input
                      disabled={!isEditing}
                      value={bankDetails.accountHolder}
                      onChange={(e) => handleBankDetailsChange('accountHolder', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Name</label>
                    <Input
                      disabled={!isEditing}
                      value={bankDetails.bankName}
                      onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Account Number</label>
                    <Input
                      disabled={!isEditing}
                      value={bankDetails.accountNumber}
                      onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Account Type</label>
                    <select
                      disabled={!isEditing}
                      value={bankDetails.accountType}
                      onChange={(e) => handleBankDetailsChange('accountType', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">
                      {bankDetails.isVerified ? '✓ Account Verified' : '⚠ Verification Pending'}
                    </p>
                    <p className="text-xs text-gray-600">Verified on 2024-01-15</p>
                  </div>
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Bank Details
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* VERIFICATION TAB */}
          {activeTab === 'verification' && (
            <Card>
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(verification).map(([docType, docInfo]: any) => (
                    <div key={docType} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium capitalize">
                          {docType.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        {docInfo.verified ? (
                          <p className="text-sm text-green-600">✓ Verified on {docInfo.verificationDate}</p>
                        ) : (
                          <p className="text-sm text-orange-600">⏳ Pending Verification</p>
                        )}
                      </div>
                      <Button
                        variant={docInfo.verified ? 'secondary' : 'default'}
                        size="sm"
                        onClick={() => handleUploadDocument(docType)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {docInfo.verified ? 'Update' : 'Upload'}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Verification Progress:</strong> 2 of 4 documents verified (50%). Complete all documents to unlock premium features.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(preferences).map(([pref, enabled]) => (
                  <div key={pref} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">
                        {pref.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {pref === 'emailNotifications' && 'Receive email notifications for inquiries and updates'}
                        {pref === 'smsNotifications' && 'Receive SMS alerts for urgent messages'}
                        {pref === 'weeklyReports' && 'Get weekly performance and analytics reports'}
                        {pref === 'marketingEmails' && 'Receive offers, promotions, and platform updates'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      checked={enabled}
                      onChange={(e) => handlePreferencesChange(pref, e.target.checked)}
                      className="w-5 h-5 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                ))}

                {isEditing && (
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 mt-4">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
