import { useState } from 'react';
import { Bot, X, Send, FileText, MapPin, AlertCircle, TrendingUp, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { User } from '../App';

interface AIAssistantProps {
  user: User;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AIAssistant({ user, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello ${user.name}! I'm your AI assistant for CM Platform. I can help you with:\n\n• Land verification and documentation\n• Historical analysis and insights\n• Construction feasibility assessment\n• Legal requirements and compliance\n• Risk analysis and recommendations\n\nWhat would you like to know?`,
      timestamp: new Date(),
      suggestions: [
        'Check land documentation status',
        'Explain AI verification process',
        'What documents do I need?',
        'Analyze construction feasibility'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    // Get current conversation history before adding new message
    const currentHistory = messages.slice(-6);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText, currentHistory);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string, conversationHistory?: Message[]): Message => {
    const lowerMessage = userMessage.toLowerCase();
    const history = conversationHistory || messages.slice(-6); // Use provided history or fallback to current messages

    let response = '';
    let suggestions: string[] = [];

    // Enhanced conversation logic with context awareness
    const hasAskedAboutDocuments = conversationHistory.some(msg =>
      msg.type === 'user' && (msg.content.toLowerCase().includes('document') || msg.content.toLowerCase().includes('paper'))
    );

    const hasAskedAboutVerification = conversationHistory.some(msg =>
      msg.type === 'user' && msg.content.toLowerCase().includes('verif')
    );

    const hasAskedAboutConstruction = conversationHistory.some(msg =>
      msg.type === 'user' && (msg.content.toLowerCase().includes('construct') || msg.content.toLowerCase().includes('build'))
    );

    // Follow-up responses based on conversation context
    if (lowerMessage.includes('what if') && hasAskedAboutDocuments) {
      response = `If documents are missing or incomplete, here are your options:\n\n🔄 **Document Procurement Service**\n• We can help obtain missing documents through official channels\n• Legal assistance for document recovery\n• Timeline: 7-14 days depending on document type\n\n⚡ **Alternative Verification Methods**\n• Enhanced AI analysis using available data\n• Third-party verification services\n• Reduced verification timeline (2-3 days)\n\n💡 **Recommendations**\n• Start with essential documents first\n• Some documents can be obtained digitally\n• Cost varies by document type and location\n\nWould you like me to help you identify which documents you can obtain quickly?`;
      suggestions = ['Help me prioritize documents', 'Cost for missing documents', 'Alternative verification'];
    } else if (lowerMessage.includes('how long') || lowerMessage.includes('timeline')) {
      response = `Here's the typical timeline for our land verification process:\n\n📅 **Complete Process: 3-5 Business Days**\n\nDay 1: Document Upload & Initial AI Scan (4-6 hours)\nDay 2: Cross-reference & Database Verification (8-12 hours)\nDay 3: Legal Review & Risk Assessment (4-8 hours)\nDay 4: Physical Survey Coordination (if required)\nDay 5: Final Report Generation & Delivery\n\n⚡ **Express Service Available**\n• Rush verification: 24-48 hours\n• Additional cost: 50% premium\n• Available for urgent transactions\n\n📊 **Progress Tracking**\n• Real-time updates via dashboard\n• Email notifications at each stage\n• Direct communication with assigned specialist\n\nFactors affecting timeline:\n• Document completeness\n• Property location complexity\n• Current verification queue\n• Seasonal demand variations`;
      suggestions = ['Express service details', 'Track my verification', 'What affects timeline?'];
    } else if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('fee')) {
      response = `Our pricing is transparent and based on property value and complexity:\n\n💰 **Standard Verification Package**\n• Base fee: $299 (properties under $500K)\n• Tiered pricing: 0.1-0.3% of property value\n• Maximum fee cap: $2,500\n\n📋 **What's Included**\n• Complete AI-powered verification\n• Legal document review\n• Risk assessment report\n• Construction feasibility analysis\n• 30-day support period\n\n🚀 **Additional Services**\n• Express processing: +$150\n• International verification: +$300\n• Construction blueprint review: +$200\n• Environmental impact study: +$400\n\n💳 **Payment Terms**\n• 50% upfront, 50% upon completion\n• All major credit cards accepted\n• Wire transfer for large transactions\n• Refund policy: Full refund if unsatisfied\n\nWould you like a personalized quote for your property?`;
      suggestions = ['Get personalized quote', 'Payment options', 'Refund policy details'];
    } else if (lowerMessage.includes('document') || lowerMessage.includes('documentation') || lowerMessage.includes('what do i need')) {
      response = `For complete land verification, you'll need the following documents:\n\n📄 **ESSENTIAL DOCUMENTS (Required)**\n• Title Deed or Ownership Certificate\n• Recent Land Survey Report (within 2 years)\n• Property Tax Records (last 5 years)\n• Zoning Compliance Certificate\n\n📋 **HIGHLY RECOMMENDED**\n• Encumbrance Certificate (no legal claims)\n• Soil Analysis Report\n• Water Rights Certificate\n• Environmental Clearance\n\n📝 **OPTIONAL BUT HELPFUL**\n• Building Permits (if any)\n• Utility Bills (recent)\n• Previous Transaction Records\n• Aerial Photographs\n\n🔍 **Document Requirements**\n• Must be original or certified copies\n• Recent (within 6-12 months preferred)\n• Clear, legible scans or photos\n• All pages included\n\n💡 **Pro Tip**: Start with essential documents first. We can often proceed with partial documentation and obtain missing items through official channels.\n\nWould you like me to help you prepare your documents for upload?`;
      suggestions = ['Help me upload documents', 'Check document status', 'What if documents are missing?'];
    } else if (lowerMessage.includes('verification') || lowerMessage.includes('verify') || lowerMessage.includes('process')) {
      response = `Our comprehensive AI verification process ensures 100% accuracy:\n\n🤖 **PHASE 1: AI-Powered Analysis (4-6 hours)**\n• Document authenticity verification using ML\n• Cross-reference with 50+ government databases\n• Historical ownership tracing (30+ years)\n• Satellite imagery analysis for land use\n\n🔍 **PHASE 2: Legal Compliance Check (8-12 hours)**\n• Zoning law verification\n• Tax compliance validation\n• Dispute and litigation search\n• Environmental restriction screening\n\n✅ **PHASE 3: Human Expert Review (4-8 hours)**\n• Legal team final validation\n• Risk assessment by certified experts\n• Construction feasibility evaluation\n• Final report compilation\n\n📊 **PHASE 4: Physical Verification (Optional)**\n• On-site survey coordination\n• Boundary confirmation\n• Access and utility verification\n\n🎯 **Output: Comprehensive Report**\n• AI Confidence Score (0-100)\n• Risk Rating (Low/Medium/High)\n• Detailed findings and recommendations\n• Construction feasibility analysis\n• Market value estimation\n\nYour property receives a unique verification ID for tracking and future reference.`;
      suggestions = ['What is AI Score?', 'View sample report', 'Schedule verification'];
    } else if (lowerMessage.includes('construction') || lowerMessage.includes('build') || lowerMessage.includes('feasibility')) {
      response = `Our AI Construction Feasibility Analysis provides comprehensive building guidance:\n\n🏗️ **STRUCTURAL ANALYSIS**\n• Soil bearing capacity assessment\n• Foundation type recommendations\n• Seismic risk evaluation\n• Wind and weather impact analysis\n\n📐 **SITE PLANNING**\n• Optimal building placement\n• Access road feasibility\n• Utility connection planning\n• Drainage and water management\n\n🌍 **ENVIRONMENTAL FACTORS**\n• Flood zone classification\n• Protected area restrictions\n• Wildlife habitat impact\n• Natural resource considerations\n\n💰 **COST ESTIMATION**\n• Foundation costs by type\n• Site preparation expenses\n• Infrastructure requirements\n• Total development budget\n\n📋 **DELIVERABLES**\n• Detailed feasibility report\n• Construction recommendations\n• Risk mitigation strategies\n• Alternative development options\n• Cost-benefit analysis\n\n🎯 **Additional Services**\n• Architectural blueprint review\n• Engineering consultation\n• Permit assistance\n• Contractor recommendations\n\nWould you like a detailed feasibility analysis for your specific property?`;
      suggestions = ['Get feasibility report', 'Cost estimation details', 'Permit requirements'];
    } else if (lowerMessage.includes('risk') || lowerMessage.includes('safety') || lowerMessage.includes('problem')) {
      response = `Our comprehensive risk assessment identifies and quantifies all potential issues:\n\n⚠️ **LEGAL RISKS**\n• Ownership disputes or claims\n• Pending litigation or cases\n• Tax arrears or penalties\n• Encumbrances or liens\n• Inheritance complications\n\n🌊 **ENVIRONMENTAL RISKS**\n• Flood zone classification\n• Protected forest areas\n• Wetland restrictions\n• Endangered species habitats\n• Soil contamination potential\n\n🏛️ **REGULATORY RISKS**\n• Zoning violations\n• Building code non-compliance\n• Land use restrictions\n• Future development plans\n• Permit requirements\n\n📊 **RISK SCORING SYSTEM**\n• Low Risk (0-25): Minimal concerns\n• Medium Risk (26-50): Some issues to address\n• High Risk (51-75): Significant challenges\n• Critical Risk (76-100): Major obstacles\n\n🛡️ **RISK MITIGATION**\n• Detailed action plans\n• Legal remedy suggestions\n• Cost estimates for fixes\n• Alternative property options\n\n💡 **Pro Tip**: Most medium-risk issues can be resolved with proper legal assistance and additional documentation.\n\nWould you like me to assess risks for a specific property?`;
      suggestions = ['Risk assessment guide', 'How to mitigate risks', 'Legal remedies'];
    } else if (lowerMessage.includes('value') || lowerMessage.includes('worth') || lowerMessage.includes('price') || lowerMessage.includes('market')) {
      response = `Our AI-powered valuation provides accurate market pricing:\n\n💹 **MARKET ANALYSIS**\n• Comparative sales data (1000+ properties)\n• Historical price trends (10+ years)\n• Location-based adjustments\n• Demand and supply indicators\n\n📊 **VALUATION FACTORS**\n• Land size and shape\n• Soil quality and topography\n• Access to utilities and roads\n• Legal clarity and documentation\n• Development potential\n• Environmental factors\n• Economic indicators\n\n🎯 **VALUATION METHODS**\n• Sales Comparison Approach\n• Income Capitalization (if applicable)\n• Cost Approach for development land\n• AI-enhanced predictive modeling\n\n📈 **REPORT INCLUDES**\n• Fair Market Value Range\n• Confidence Interval\n• Investment Potential Rating\n• Best Time to Buy/Sell\n• Market Trend Predictions\n\n💰 **ADDITIONAL SERVICES**\n• Comparative Market Analysis\n• Investment Feasibility Study\n• Portfolio Valuation\n• Market Research Reports\n\nWould you like a property valuation for your land?`;
      suggestions = ['Get property valuation', 'Market trends', 'Investment analysis'];
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('assist')) {
      response = `I'm here to help you with every aspect of land verification and property transactions!\n\n🗣️ **HOW I CAN HELP**\n\n📋 **Document Guidance**\n• Required document checklists\n• Document preparation tips\n• Upload assistance\n• Missing document solutions\n\n🔍 **Verification Process**\n• Step-by-step explanations\n• Timeline guidance\n• Progress tracking\n• Issue resolution\n\n🏗️ **Construction Planning**\n• Feasibility analysis\n• Cost estimation\n• Permit guidance\n• Contractor recommendations\n\n⚖️ **Legal Support**\n• Compliance checking\n• Risk assessment\n• Legal requirement explanations\n• Expert consultation coordination\n\n💰 **Financial Planning**\n• Pricing insights\n• Cost breakdowns\n• Investment analysis\n• Financing options\n\n📞 **Direct Support**\n• Connect with specialists\n• Schedule consultations\n• Emergency assistance\n• Multi-language support\n\n💡 **Pro Tips**\n• Ask specific questions for detailed answers\n• Mention your property location for localized advice\n• Share your timeline for priority guidance\n• Ask about costs upfront\n\nWhat specific aspect would you like help with today?`;
      suggestions = ['Document help', 'Verification process', 'Cost guidance', 'Legal questions'];
    } else {
      // Generic response with context awareness
      const contextHints = [];
      if (hasAskedAboutDocuments) contextHints.push('documents');
      if (hasAskedAboutVerification) contextHints.push('verification');
      if (hasAskedAboutConstruction) contextHints.push('construction');

      const contextText = contextHints.length > 0
        ? ` (I see you've been asking about ${contextHints.join(' and ')})`
        : '';

      response = `I understand you're asking about "${userMessage}"${contextText}. I'm here to help with all aspects of land verification and property transactions.\n\n🤔 **COMMON QUESTIONS I CAN ANSWER**\n\n📄 **Documents & Paperwork**\n• What documents do you need?\n• How to prepare documents for upload?\n• What if documents are missing?\n\n🔍 **Verification Process**\n• How does AI verification work?\n• How long does it take?\n• What affects the timeline?\n\n💰 **Costs & Pricing**\n• How much does verification cost?\n• What payment options are available?\n• Refund policy details\n\n🏗️ **Construction & Development**\n• Is the land suitable for building?\n• Construction cost estimates?\n• Permit requirements?\n\n⚠️ **Risks & Safety**\n• What risks should you be aware of?\n• How to mitigate identified risks?\n• Legal protection options\n\n📊 **Property Value**\n• What's your property worth?\n• Market trends and analysis?\n• Investment potential?\n\n💬 **Just ask me anything!**\nI'm designed to handle unlimited questions and provide detailed, helpful responses. Feel free to ask follow-ups or dive deeper into any topic.\n\nWhat would you like to know more about?`;

      suggestions = [
        'Tell me about the process',
        'What documents do I need?',
        'How much does it cost?',
        'Is my land buildable?'
      ];
    }

    // Log the user message for debugging (optional)
    console.log(`AI Assistant: Generated response for "${userMessage}"`);

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl h-[600px] flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div>AI Assistant</div>
                <div className="text-xs font-normal text-gray-600">
                  Powered by CM Platform AI
                </div>
              </div>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'ai' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                      : 'bg-gray-600'
                  }`}>
                    {message.type === 'ai' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {user.name[0]}
                      </span>
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-[85%] p-3 rounded-lg ${
                      message.type === 'ai'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-blue-600 text-white'
                    }`}>
                      <div className="whitespace-pre-line text-sm">{message.content}</div>
                    </div>
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendMessage(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex gap-2 mb-3 overflow-x-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendMessage('What documents do I need?')}
              >
                <FileText className="w-3 h-3 mr-1" />
                Documents
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendMessage('Explain verification process')}
              >
                <AlertCircle className="w-3 h-3 mr-1" />
                Verification
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendMessage('Construction feasibility')}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Construction
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendMessage('Risk assessment')}
              >
                <MapPin className="w-3 h-3 mr-1" />
                Risk
              </Button>
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about land verification..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={() => handleSendMessage()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
