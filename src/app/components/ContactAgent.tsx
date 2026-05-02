import { useState } from 'react';
import { Shield, LogOut, Bot, MapPin, ChevronLeft, MessageCircle, Phone, PhoneCall, Mail, MapPinIcon, MessageCircleIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User } from '../App';

interface ContactAgentProps {
  user: User;
  landId: string;
  landTitle: string;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
}

const mockLandOwners = {
  '1': {
    name: 'John Martinez',
    title: 'Land Owner - Agricultural Expert',
    location: 'Fresno County, California',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: 'Experienced land owner with 15+ years in agricultural land management and sales.',
    mobileNumber: '+1 (559) 123-4567',
    alternativeNumber: '+1 (559) 987-6543',
    whatsappNumber: '+1 (559) 123-4567',
    email: 'john.martinez@landowners.com',
    responseTime: 'Usually responds within 2 hours',
    verificationBadges: ['Verified Seller', '4.8/5 Rating', '50+ Properties Sold'],
    recentReviews: [
      { author: 'Sarah Johnson', rating: 5, text: 'Excellent communication and very transparent process' },
      { author: 'Mike Chen', rating: 5, text: 'Quick response and honest about property details' }
    ]
  },
  '2': {
    name: 'Maria Rodriguez',
    title: 'Real Estate Agent',
    location: 'Austin, Texas',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    bio: 'Professional real estate agent specializing in residential properties in Austin area.',
    mobileNumber: '+1 (512) 456-7890',
    alternativeNumber: '+1 (512) 321-0987',
    whatsappNumber: '+1 (512) 456-7890',
    email: 'maria.rodriguez@realestate.com',
    responseTime: 'Usually responds within 1 hour',
    verificationBadges: ['Verified Agent', '4.9/5 Rating', '100+ Properties Sold'],
    recentReviews: [
      { author: 'David Wilson', rating: 5, text: 'Professional and knowledgeable' },
      { author: 'Emma Davis', rating: 5, text: 'Best experience buying property' }
    ]
  },
  '3': {
    name: 'Alex Thompson',
    title: 'Commercial Property Developer',
    location: 'Miami, Florida',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    bio: 'Experienced commercial developer with expertise in strategic land development and commercial ventures.',
    mobileNumber: '+1 (305) 789-0123',
    alternativeNumber: '+1 (305) 654-3210',
    whatsappNumber: '+1 (305) 789-0123',
    email: 'alex.thompson@properties.com',
    responseTime: 'Usually responds within 4 hours',
    verificationBadges: ['Verified Developer', '4.7/5 Rating', '25+ Major Projects'],
    recentReviews: [
      { author: 'Robert Hall', rating: 4, text: 'Good communication, professional approach' },
      { author: 'Lisa Brown', rating: 5, text: 'Helped us understand the investment potential' }
    ]
  }
};

export function ContactAgent({ user, landId, landTitle, onLogout, onBack, onToggleAI }: ContactAgentProps) {
  const owner = mockLandOwners[landId as keyof typeof mockLandOwners] || mockLandOwners['1'];
  const [showPhoneWarning, setShowPhoneWarning] = useState(false);

  const handleCallClick = (phoneNumber: string) => {
    // Create tel link to initiate phone call
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
  };

  const handleWhatsAppClick = (phoneNumber: string) => {
    // Open WhatsApp with the phone number
    // WhatsApp Web format: https://wa.me/phonenumber
    // Remove all non-digit characters and format properly
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${cleanNumber}?text=Hi, I'm interested in the land property`;
    window.open(whatsappLink, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${owner.email}?subject=Inquiry about ${landTitle}`;
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
                Back
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Header */}
        <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Property:</p>
            <h1 className="text-2xl font-bold text-gray-900">{landTitle}</h1>
          </CardContent>
        </Card>

        {/* Owner Profile Card */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <img
                  src={owner.profileImage}
                  alt={owner.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">{owner.name}</h2>
                  </div>
                  <p className="text-orange-600 font-medium mb-2">{owner.title}</p>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <MapPinIcon className="w-4 h-4" />
                    {owner.location}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {owner.verificationBadges.map((badge, idx) => (
                      <Badge key={idx} className="bg-green-100 text-green-800 border-0">
                        ✓ {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-4">{owner.bio}</p>
            <p className="text-sm text-green-600 font-medium mb-6">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              {owner.responseTime}
            </p>
          </CardContent>
        </Card>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Mobile Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                Mobile Numbers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Primary Mobile Number */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-blue-100">
                <p className="text-sm text-gray-600 mb-2">Primary Contact</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">{owner.mobileNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">Direct mobile number</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCallClick(owner.mobileNumber)}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call Now
                  </Button>
                </div>
              </div>

              {/* Alternative Mobile Number */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Alternative Contact</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{owner.alternativeNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">Secondary mobile number</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCallClick(owner.alternativeNumber)}
                    className="gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp & Email Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Messaging
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* WhatsApp */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-100">
                <p className="text-sm text-gray-600 mb-2">Chat on WhatsApp</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MessageCircleIcon className="w-5 h-5 text-green-600" />
                      {owner.whatsappNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Instant messaging</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleWhatsAppClick(owner.whatsappNumber)}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Email */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Email</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 break-all">{owner.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Professional inquiry</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEmailClick}
                    className="gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {owner.recentReviews.map((review, idx) => (
              <div key={idx} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{review.author}</h4>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Guidelines */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Contact Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-2">
            <p>✓ Be polite and professional in your communication</p>
            <p>✓ Ask specific questions about the property</p>
            <p>✓ Request to schedule a site visit at a convenient time</p>
            <p>✓ Ask about available documents and verification details</p>
            <p>✓ Avoid sharing personal financial information initially</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
