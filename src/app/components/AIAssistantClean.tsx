import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Sparkles, StopCircle, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { User } from '../App';

interface AIAssistantProps {
  user: User;
  onClose: () => void;
  initialQuestion?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

// Get API URL from environment or use default
const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_AI_SERVER_URL;
  const apiUrl = (envUrl && typeof envUrl === 'string' && envUrl.trim())
    ? `${envUrl.replace(/\/$/, '')}/api/chat`
    : 'http://localhost:5000/api/chat';
  console.log('🔗 API URL:', apiUrl);
  return apiUrl;
};

const API_URL = getApiUrl();

export function AIAssistant({ user, onClose, initialQuestion }: AIAssistantProps) {
  const createGreeting = (): Message => ({
    id: 'greeting',
    role: 'assistant',
    content: `Hello ${user.name}! I'm your AI assistant for CM Platform. I can help you with:\n\n• Land verification and documentation\n• Historical analysis and insights\n• Construction feasibility assessment\n• Legal requirements and compliance\n• Risk analysis and recommendations\n\nWhat would you like to know?`,
    timestamp: new Date(),
    suggestions: [
      'Check land documentation status',
      'Explain AI verification process',
      'What documents do I need?',
      'Analyze construction feasibility'
    ]
  });

  const [messages, setMessages] = useState<Message[]>([createGreeting()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastSeededPrompt = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const stopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsTyping(false);
  };

  const startNewChat = () => {
    stopResponse();
    setMessages([createGreeting()]);
    setInputValue('');
    setError(null);
    lastSeededPrompt.current = null;
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText || isTyping) return;

    stopResponse();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      console.log('📤 Sending message:', messageText);
      console.log('📍 Using API URL:', API_URL);

      const conversationHistory = messages
        .filter(m => !m.suggestions)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, conversationHistory }),
        signal: abortControllerRef.current.signal,
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Server error: ${response.status} - ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Got response:', data.reply.substring(0, 50));
      
      if (data.error) throw new Error(data.error);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('❌ Fetch error:', err.message);
        setError(err.message || 'Failed to get response. Please try again.');
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content:
            '⚠️ Sorry, I encountered an error. Please check:\n\n1. Backend server is running (check server terminal)\n2. Your OpenAI API key is valid\n3. Check browser console (F12) and server logs for details\n\nError: ' + (err.message || 'Unknown error'),
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    if (initialQuestion && initialQuestion !== lastSeededPrompt.current) {
      lastSeededPrompt.current = initialQuestion;
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = null;
      lastSeededPrompt.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl h-[600px] flex flex-col bg-slate-900 border-cyan-500/20">
        <CardHeader className="border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-white">
                  AI Assistant
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xs font-normal text-slate-400">Powered by OpenAI GPT-4</div>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={startNewChat} title="New Chat">
                <RotateCcw className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-slate-900">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${message.role === 'user' ? '' : 'flex gap-3'}`}>
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                          : 'bg-slate-800 text-slate-100'
                      }`}>
                        <div className="whitespace-pre-line text-sm leading-relaxed">{message.content}</div>
                      </div>
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.suggestions.map((s, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendMessage(s)}
                              disabled={isTyping}
                              className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-700"
                            >
                              {s}
                            </Button>
                          ))}
                        </div>
                      )}
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-cyan-100 text-right' : 'text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-slate-400 text-sm">AI is thinking...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="px-4 pb-2 bg-slate-900">
              <p className="text-xs text-slate-400 mb-2">Quick prompts:</p>
              <div className="flex flex-wrap gap-2">
                {['What documents do I need?', 'Explain verification process', 'Construction feasibility', 'Risk assessment'].map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(q)}
                    disabled={isTyping}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-700"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-slate-700 bg-slate-900">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about land verification..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isTyping}
                className="flex-1 bg-slate-800 text-white border-slate-700 focus:border-cyan-500 focus:ring-cyan-500 disabled:opacity-50"
              />
              {isTyping ? (
                <Button onClick={stopResponse} className="bg-red-500 hover:bg-red-600 text-white">
                  <StopCircle className="w-5 h-5" />
                </Button>
              ) : (
                <Button onClick={() => handleSendMessage()} disabled={!inputValue.trim()} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white">
                  <Send className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
