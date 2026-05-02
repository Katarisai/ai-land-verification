/**
 * 🤖 LAND-SPECIFIC AI CHATBOT COMPONENT
 * 
 * Context-Aware Chatbot for Land Verification System
 * - Each land has its own AI context
 * - Chatbot only answers questions about the selected land
 * - Uses OpenAI API with land data context
 */

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, AlertCircle, Share2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface LandData {
  landId: string;
  owner: string;
  location: string;
  surveyNumber: string;
  price: number;
  area: number;
  areaUnit: string;
  landType: string;
  legalStatus: string;
  documents: string[];
  aiSummary: string;
  chatContext: string; // Full extracted document + structured data
  verified: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LandChatbotProps {
  land: LandData;
  onClose?: () => void;
}

const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_AI_SERVER_URL;
  return (envUrl && typeof envUrl === 'string' && envUrl.trim())
    ? `${envUrl.replace(/\/$/, '')}/api/chat`
    : 'http://localhost:5000/api/chat';
};

const API_URL = getApiUrl();

export function LandChatbot({ land, onClose }: LandChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (!isInitialized) {
      const welcomeMessage: Message = {
        id: '0',
        role: 'assistant',
        content: `Welcome! 👋 I'm your AI Land Assistant for ${land.location}. I have access to all details about this land property. You can ask me questions about:
        
        • Ownership & legal status
        • Land location & GPS coordinates
        • Survey number & boundaries
        • Price & area details
        • Documents & verification status
        • Risk assessment & alerts
        
        Ask me anything about this land!`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      setIsInitialized(true);
    }
  }, [land, isInitialized]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Generate AI context for the chatbot
   * This context is sent to OpenAI to restrict responses to this land only
   */
  const generateLandContext = (): string => {
    const context = `
LAND INFORMATION CONTEXT:
=========================

Land ID: ${land.landId}
Survey Number: ${land.surveyNumber}
Owner: ${land.owner}
Location: ${land.location}
Area: ${land.area} ${land.areaUnit}
Price: ₹${land.price.toLocaleString('en-IN')}
Land Type: ${land.landType}
Legal Status: ${land.legalStatus}
Verification Status: ${land.verified ? '✓ Verified' : '✗ Not Verified'}
Risk Level: ${land.riskLevel.toUpperCase()}

AI GENERATED SUMMARY:
${land.aiSummary}

EXTRACTED DOCUMENT DATA:
${land.chatContext}

IMPORTANT INSTRUCTIONS:
1. Answer ONLY based on the above land information
2. If information is not in the provided data, say: "This information is not available in this land record"
3. Be professional and honest
4. Highlight any risk alerts or concerns
5. Provide clear, concise answers
`;
    return context;
  };

  /**
   * Send message to OpenAI with land context
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Call OpenAI API with land context
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          landContext: generateLandContext(),
          landId: land.landId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `❌ Error: Unable to process your question. Please try again. ${error instanceof Error ? error.message : ''}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <CardHeader className="pb-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-sm">Land Assistant</CardTitle>
            <p className="text-xs text-gray-600">{land.location} • {land.surveyNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={land.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
            {land.verified ? '✓ Verified' : 'Pending'}
          </Badge>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          )}
        </div>
      </CardHeader>

      {/* Land Info Alert */}
      {land.riskLevel === 'high' && (
        <div className="bg-red-50 border-b border-red-200 p-2 flex items-start gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-red-700">
            ⚠️ High Risk Alert: This land has potential concerns. Please review the documents carefully.
          </div>
        </div>
      )}

      {/* Messages Container */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-orange-600 text-white rounded-bl-none'
                  : 'bg-white border border-gray-200 text-gray-900 rounded-br-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-orange-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg rounded-br-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs font-medium text-gray-700 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              '🔒 Is this land legally safe?',
              'Who is the owner?',
              '📍 What's the GPS location?',
              '💰 What is the price?',
              '⚖️ What is the legal status?',
              '📊 Show me the verification status'
            ].map((question, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(question);
                }}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 border border-blue-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-3 bg-white">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about this land..."
            rows={2}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 flex items-center gap-2 font-medium"
          >
            {loading ? '...' : <Send className="w-4 h-4" />}
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
          <MessageCircle className="w-3 h-3" />
          🔒 Responses are based only on this land's verified data
        </div>
      </div>
    </Card>
  );
}

export default LandChatbot;
