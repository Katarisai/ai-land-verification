import { useState } from 'react';
import { Search, Filter, MessageSquare, Calendar, Phone, Mail, ChevronDown, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { User } from '../App';

interface InquiryManagementProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
}

interface Inquiry {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  listingTitle: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'won' | 'lost';
  buyerType: string;
  timeline: string;
  budget: { min: number; max: number };
  views: number;
  inquiries: number;
  createdAt: string;
  lastMessage: string;
  responseTime?: string;
  conversation: Array<{ sender: string; message: string; time: string }>;
}

export function InquiryManagement({ user, onLogout, onBack, onToggleAI }: InquiryManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'negotiating' | 'won' | 'lost'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [meetings, setMeetings] = useState<any>({});

  // Mock Inquiries Data
  const [inquiries] = useState<Inquiry[]>([
    {
      id: '1',
      buyerName: 'Robert Johnson',
      buyerEmail: 'robert.johnson@email.com',
      buyerPhone: '+1-555-0123',
      listingTitle: '5.2 Acres Agricultural Land',
      message: 'Hi, I am very interested in this agricultural land. Can you provide more details about water access and soil quality?',
      status: 'new',
      buyerType: 'Investor',
      timeline: 'immediate',
      budget: { min: 100000, max: 150000 },
      views: 456,
      inquiries: 23,
      createdAt: '2024-04-14 10:30 AM',
      lastMessage: 'Hi, I am very interested...',
      conversation: [
        { sender: 'buyer', message: 'Hi, I am very interested in this property', time: '10:30 AM' },
      ],
    },
    {
      id: '2',
      buyerName: 'Sarah Williams',
      buyerEmail: 'sarah.williams@email.com',
      buyerPhone: '+1-555-0124',
      listingTitle: '2.8 Acres Residential Plot',
      message: 'Great property! When can I schedule a viewing?',
      status: 'contacted',
      buyerType: 'First-time Buyer',
      timeline: '1-3 months',
      budget: { min: 80000, max: 120000 },
      views: 389,
      inquiries: 18,
      createdAt: '2024-04-13 02:15 PM',
      lastMessage: 'Thank you for your interest...',
      responseTime: '2 hours',
      conversation: [
        { sender: 'buyer', message: 'Great property! When can I schedule a viewing?', time: '2:15 PM' },
        { sender: 'seller', message: 'Thank you for your interest. I can schedule a viewing this weekend.', time: '4:20 PM' },
      ],
    },
    {
      id: '3',
      buyerName: 'Michael Chen',
      buyerEmail: 'michael.chen@email.com',
      buyerPhone: '+1-555-0125',
      listingTitle: '10 Acres Commercial Land',
      message: 'I have a detailed proposal for development. Can we discuss terms?',
      status: 'qualified',
      buyerType: 'Developer',
      timeline: 'immediate',
      budget: { min: 400000, max: 500000 },
      views: 567,
      inquiries: 31,
      createdAt: '2024-04-12 09:45 AM',
      lastMessage: 'I have a detailed proposal...',
      responseTime: '1 hour',
      conversation: [
        { sender: 'buyer', message: 'I have a detailed proposal for development', time: '9:45 AM' },
        { sender: 'seller', message: 'Excellent! I would like to discuss your proposal.', time: '10:30 AM' },
        { sender: 'buyer', message: 'Great! How about Tuesday at 2 PM?', time: '11:00 AM' },
      ],
    },
    {
      id: '4',
      buyerName: 'Jessica Martinez',
      buyerEmail: 'jessica.martinez@email.com',
      buyerPhone: '+1-555-0126',
      listingTitle: '15 Acres Forest Land',
      message: 'Negotiating the final price. Can you come down to $195K?',
      status: 'negotiating',
      buyerType: 'Investor',
      timeline: '1-3 months',
      budget: { min: 190000, max: 210000 },
      views: 234,
      inquiries: 12,
      createdAt: '2024-04-11 03:30 PM',
      lastMessage: 'Negotiating the final price...',
      responseTime: '30 minutes',
      conversation: [
        { sender: 'buyer', message: 'Can you come down to $195K?', time: '3:30 PM' },
        { sender: 'seller', message: 'I can offer $200K. This property is in high demand.', time: '3:45 PM' },
      ],
    },
    {
      id: '5',
      buyerName: 'David Thompson',
      buyerEmail: 'david.thompson@email.com',
      buyerPhone: '+1-555-0127',
      listingTitle: '3.5 Acres Mixed Use',
      message: 'Deal closed! Excited to start development on this beautiful property.',
      status: 'won',
      buyerType: 'Developer',
      timeline: 'immediate',
      budget: { min: 170000, max: 185000 },
      views: 345,
      inquiries: 15,
      createdAt: '2024-04-02 11:00 AM',
      lastMessage: 'Deal closed! Excited to start...',
      responseTime: '45 minutes',
      conversation: [
        { sender: 'buyer', message: 'I will take it at your asking price!', time: '11:00 AM' },
        { sender: 'seller', message: 'Congratulations! Lets get the paperwork done.', time: '11:15 AM' },
      ],
    },
  ]);

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedInquiryData = inquiries.find((i) => i.id === selectedInquiry);

  const handleReply = () => {
    if (!replyMessage.trim() || !selectedInquiry) return;

    console.log(`Sending reply to inquiry ${selectedInquiry}:`, replyMessage);
    alert('Reply sent successfully!');
    setReplyMessage('');
  };

  const handleStatusChange = (inquiryId: string, newStatus: string) => {
    console.log(`Updating inquiry ${inquiryId} status to ${newStatus}`);
    alert(`Inquiry status updated to ${newStatus}`);
  };

  const handleScheduleMeeting = () => {
    if (!selectedInquiry) return;
    console.log('Meeting scheduled');
    alert('Meeting scheduled successfully!');
    setShowMeetingDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'negotiating':
        return 'bg-orange-100 text-orange-800';
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-4 h-4" />;
      case 'qualified':
        return <CheckCircle className="w-4 h-4" />;
      case 'won':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
              <h1 className="text-2xl font-bold">Inquiry Management</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onToggleAI}>Ask AI</Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{inquiries.length}</div>
                <p className="text-gray-600 text-sm mt-1">Total Inquiries</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {inquiries.filter((i) => i.status === 'new').length}
                </div>
                <p className="text-gray-600 text-sm mt-1">New</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {inquiries.filter((i) => i.status === 'won').length}
                </div>
                <p className="text-gray-600 text-sm mt-1">Closed (Won)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {inquiries.filter((i) => i.status === 'qualified').length}
                </div>
                <p className="text-gray-600 text-sm mt-1">Qualified Leads</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search by buyer name, email, or property..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inquiries List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Inquiries ({filteredInquiries.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedInquiry === inquiry.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{inquiry.buyerName}</h3>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{inquiry.listingTitle}</p>
                    <p className="text-xs text-gray-500">{inquiry.createdAt}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Inquiry Details */}
          {selectedInquiryData && (
            <div className="lg:col-span-2 space-y-6">
              {/* Buyer Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Buyer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Name</p>
                      <p className="font-medium">{selectedInquiryData.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Buyer Type</p>
                      <Badge variant="outline">{selectedInquiryData.buyerType}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <a href={`mailto:${selectedInquiryData.buyerEmail}`} className="text-blue-600 text-sm hover:underline">
                        {selectedInquiryData.buyerEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <a href={`tel:${selectedInquiryData.buyerPhone}`} className="text-blue-600 text-sm hover:underline">
                        {selectedInquiryData.buyerPhone}
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Budget</p>
                      <p className="font-medium">
                        ${selectedInquiryData.budget.min}-${selectedInquiryData.budget.max}K
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Timeline</p>
                      <p className="font-medium capitalize">{selectedInquiryData.timeline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property & Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Listing</p>
                    <p className="font-medium">{selectedInquiryData.listingTitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Current Status</p>
                      <Badge className={getStatusColor(selectedInquiryData.status)}>
                        <span className="mr-1">{getStatusIcon(selectedInquiryData.status)}</span>
                        {selectedInquiryData.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Response Time</p>
                      <p className="text-sm">{selectedInquiryData.responseTime || 'Not yet replied'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <select
                      value={selectedInquiryData.status}
                      onChange={(e) => handleStatusChange(selectedInquiryData.id, e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm flex-1"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="negotiating">Negotiating</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>

                    <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule Meeting</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <Input type="date" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            <Input type="time" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select className="w-full px-3 py-2 border rounded-lg">
                              <option>In-Person</option>
                              <option>Virtual</option>
                              <option>Phone</option>
                            </select>
                          </div>
                          <Button onClick={handleScheduleMeeting} className="w-full bg-blue-600">
                            Schedule Meeting
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Conversation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {selectedInquiryData.conversation.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg ${msg.sender === 'buyer' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium capitalize">{msg.sender}</p>
                          <p className="text-xs text-gray-600">{msg.time}</p>
                        </div>
                        <p className="text-sm text-gray-800">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleReply} className="w-full bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!selectedInquiry && (
            <div className="lg:col-span-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 h-64">
              <p className="text-gray-500 text-center">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
